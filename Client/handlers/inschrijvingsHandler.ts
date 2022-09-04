import moment from "moment";
import {
  ClientSession,
  Collection,
  ObjectId,
  ReadPreference,
  TransactionOptions,
} from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import {
  createInschrijving,
  getInschrijvingenByFilter,
  NewInschrijving,
} from "../controllers/InschrijvingController";
import { getKlantById, KlantCollection } from "../controllers/KlantController";
import {
  getTrainingByNaam,
  TrainingType,
} from "../controllers/TrainingController";
import mailer from "../middleware/Mailer";
import client from "../middleware/MongoDb";
import {
  ReedsIngeschrevenError,
  ResourceNotFoundError,
  TrainingVolzetError,
} from "../middleware/RequestError";
import { GroepTraining, Inschrijving } from "../types/collections";
import { geslachtType } from "../types/formTypes/registerTypes";

interface InschrijvingsHandlerInterface {
  handleInschrijving: (obj: {
    req: NextApiRequest;
    res: NextApiResponse;
  }) => Promise<void>;
  kanInschrijven: (
    InschrijvingData: NewInschrijving,
    klant_id: ObjectId,
    res: NextApiResponse
  ) => Promise<void>;
  startTransaction: () => Promise<{
    transactionOptions: TransactionOptions;
    klantCollection: Collection;
    trainingCollection: Collection;
    inschrijvingCollection: Collection;
  }>;
  processInschrijving: (
    inschrijving: any,
    klant: KlantCollection,
    training: string,
    data: any,
    session: ClientSession,
    res: NextApiResponse
  ) => Promise<void>;
}

interface InschrijvingInterface {
  inschrijvingen: {
    datum: Date;
    hond_id: string;
    hond_naam: string;
    hond_geslacht: geslachtType;
  }[];
  training: TrainingType;
  klant_id: string;
}

const inschrijvingsHandler: InschrijvingsHandlerInterface = {
  handleInschrijving: async ({ req, res }) => {
    const { klant_id, training, inschrijvingen } =
      req.body as InschrijvingInterface;
    const { transactionOptions } = await startTransaction();

    const Training = await getTrainingByNaam(client, training);
    const klant = await getKlantById(client, new ObjectId(klant_id));
    if (!klant) throw new ResourceNotFoundError(res, "klant niet gevonden");
    if (!Training)
      throw new ResourceNotFoundError(res, "training niet gevonden");

    const email = klant.email;

    const data = { email, inschrijvingen: [] as Inschrijving[] };
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        await Promise.all(
          inschrijvingen.map(async (item: any) => {
            await processInschrijving(
              item,
              klant,
              training,
              data,
              session,
              res
            );
          }, transactionOptions)
        );
      });
      await client.close();
    } catch (e: any) {
      session.abortTransaction();
      client.close();
      throw new Error();
    }

    mailer.sendMail("inschrijving", data);

    return res.status(201).json({ message: "Inschrijving ontvangen!" });
  },

  processInschrijving: async (
    inschrijving,
    klant,
    training,
    data,
    session,
    res
  ) => {
    const { hond_id, hond_naam, datum } = inschrijving;
    const inschrijvingData = {
      hond: {
        id: new ObjectId(hond_id),
        naam: hond_naam,
      },
      klant: {
        id: klant._id,
        vnaam: klant.vnaam,
        lnaam: klant.lnaam,
      },
      datum,
      training: training as TrainingType,
    };

    const hond = klant.honden.filter(
      (hond) => hond._id.toString() === hond_id
    )[0];
    if (!hond) throw new ResourceNotFoundError(res, "Hond niet gevonden");

    await kanInschrijven(inschrijvingData, klant._id, res);
    const newInschrijving = {
      ...inschrijvingData,
      created_at: moment().local().format(),
    };

    data.inschrijvingen.push(newInschrijving);

    await createInschrijving(client, newInschrijving, session);
  },

  kanInschrijven: async (inschrijvingData, klant_id, res) => {
    const { datum, training } = inschrijvingData;
    const filter = { training, datum };

    if (training === "groep") {
      const Training = (await getTrainingByNaam(
        client,
        "groep"
      )) as GroepTraining;
      const inschrijvingen = await getInschrijvingenByFilter(client, filter);

      const reedsIngeschreven = inschrijvingen.filter(
        (inschrijving) => inschrijving.klant.id === klant_id
      );
      if (reedsIngeschreven.length > 0) throw new ReedsIngeschrevenError(res);

      if (inschrijvingen.length >= Training.max_inschrijvingen)
        throw new TrainingVolzetError(res, "Training volzet");
    }
    if (training === "prive") {
      const inschrijvingen = await getInschrijvingenByFilter(client, filter);
      const reedsIngeschreven = inschrijvingen.filter(
        (inschrijving) => inschrijving.klant.id === klant_id
      );

      if (reedsIngeschreven.length > 0) throw new ReedsIngeschrevenError(res);
      if (inschrijvingen.length > 0)
        throw new TrainingVolzetError(res, "Dit tijdstip is niet meer vrij");
    }
  },

  startTransaction: async () => {
    await client.connect();
    const transactionOptions = {
      readPreference: ReadPreference.primary,
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
    } as TransactionOptions;

    const db = client.db("degallohoeve");
    const klantCollection = db.collection("klant");
    const trainingCollection = db.collection("training");
    const inschrijvingCollection = db.collection("inschrijving");

    return {
      transactionOptions,
      klantCollection,
      trainingCollection,
      inschrijvingCollection,
    };
  },
};

export const {
  handleInschrijving,
  kanInschrijven,
  startTransaction,
  processInschrijving,
} = inschrijvingsHandler;
