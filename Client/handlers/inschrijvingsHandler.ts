import {
  ClientSession,
  Collection,
  ObjectId,
  ReadPreference,
  TransactionOptions,
} from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import mailer from "../middleware/Mailer";
import client, { findOneBy, getCollections } from "../middleware/MongoDb";
import { GroepTraining, Inschrijving, Klant } from "../types/collections";
import {
  badRequest,
  internalServerError,
  notFound,
  unProcessableEntity,
} from "./ResponseHandler";

interface InschrijvingData {
  hond_id: string;
  hond_naam: string;
  datum: Date;
  klant_id: string;
  training: string;
}

interface InschrijvingsHandlerInterface {
  handleInschrijving: (obj: {
    req: NextApiRequest;
    res: NextApiResponse;
  }) => Promise<void>;
  isPlaatsVrij: (
    InschrijvingData: InschrijvingData,
    session: ClientSession
  ) => Promise<boolean | void>;
  reedsIngeschreven: (
    inschrijvingData: InschrijvingData,
    session: ClientSession
  ) => Promise<boolean>;
  createInschrijvingDocument: (data: any) => Promise<Inschrijving>;
  createInschrijving: (
    klant_id: string,
    training: string,
    inschrijving: Inschrijving,
    session: ClientSession
  ) => Promise<boolean>;
  startTransaction: () => Promise<{
    transactionOptions: TransactionOptions;
    klantCollection: Collection;
    trainingCollection: Collection;
    inschrijvingCollection: Collection;
  }>;
  trainingEnKlantGevonden: (req: NextApiRequest) => Promise<boolean>;
}

const inschrijvingsHandler: InschrijvingsHandlerInterface = {
  handleInschrijving: async ({ req, res }) => {
    const { klant_id, training, inschrijvingen } = req.body;
    const { transactionOptions, klantCollection } = await startTransaction();
    let allChecksPassed = true;

    if (!trainingEnKlantGevonden(req))
      return notFound(res, "Probeer later opnieuw.");

    const { email } = await findOneBy(client, "klant", {
      _id: new ObjectId(klant_id),
    });
    const data = { email, inschrijvingen: [] as Inschrijving[] };
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        await Promise.all(
          inschrijvingen.map(async (item: any, index: number) => {
            const { hond_id, hond_naam, datum, tijdslot } = item;
            const inschrijvingData = {
              hond_id,
              hond_naam,
              datum,
              klant_id,
              training,
            };

            const hond = klantCollection.findOne(
              { _id: klant_id, "honden.id": hond_id },
              { session }
            );
            if (!hond) {
              allChecksPassed = false;
              return badRequest(res, "Probeer later opnieuw");
            }

            if (!(await isPlaatsVrij(inschrijvingData, session))) {
              const message =
                training === "groep"
                  ? "Training volzet"
                  : "Dit tijdstip is niet meer vrij";
              allChecksPassed = false;
              return unProcessableEntity(res, message);
            }

            if (await reedsIngeschreven(inschrijvingData, session)) {
              allChecksPassed = false;
              return res.status(400).json({
                [`inschrijvingen[${index}].date`]:
                  "U bent reeds ingeschreven voor deze training",
                message: "U bent reeds ingeschreven voor training(en)",
              });
            }

            const inschrijving = await createInschrijvingDocument(
              inschrijvingData
            );
            data.inschrijvingen.push(inschrijving);
            const succes = await createInschrijving(
              klant_id,
              training,
              inschrijving,
              session
            );
            if (!succes) {
              console.log("not succes");
              return internalServerError(res);
            }
          })
        );
        if (!allChecksPassed) return session.abortTransaction();
      }, transactionOptions);
    } catch (e: any) {
      console.log("somthing is wrong");
      client.close();
      return internalServerError(res);
    } finally {
      await client.close();
    }

    if (allChecksPassed) {
      mailer.sendMail("inschrijving", data);

      return res.status(201).json({ message: "Inschrijving ontvangen!" });
    }
    return;
  },

  isPlaatsVrij: async (inschrijvingData, session) => {
    const { datum, training } = inschrijvingData;
    const { inschrijvingCollection, trainingCollection } = getCollections([
      "inschrijving",
      "training",
    ]);
    const filter = { training, datum };

    try {
      if (training === "groep") {
        const { max_inschrijvingen } = (await trainingCollection.findOne({
          naam: training,
        })) as GroepTraining;
        const inschrijvingenGevonden = await inschrijvingCollection
          .find(filter, { session })
          .toArray();
        if (inschrijvingenGevonden.length >= max_inschrijvingen) return false;
      }
      if (training === "prive") {
        const inschrijvingGevonden = await inschrijvingCollection.findOne({
          datum,
          naam: training,
        });
        if (inschrijvingGevonden) return false;
      }
      return true;
    } catch (e: any) {
      console.log(e.message);
    }
  },

  reedsIngeschreven: async (inschrijvingData, session) => {
    const { training, klant_id, datum } = inschrijvingData;
    try {
      const inschrijving = await client
        .db("degallohoeve")
        .collection("inschrijving")
        .findOne(
          { training, datum: new Date(datum), "klant.id": klant_id },
          { session }
        );
      return inschrijving ? true : false;
    } catch (e: any) {
      console.log(e.message);
    }
    return false;
  },

  createInschrijvingDocument: async (inschrijvingData) => {
    const { datum, hond_id, hond_naam, training, klant_id } = inschrijvingData;
    const { vnaam, lnaam } = (await findOneBy(client, "klant", {
      _id: new ObjectId(klant_id),
    })) as Klant;

    return {
      datum: new Date(datum),
      training,
      hond: {
        id: hond_id,
        naam: hond_naam,
      },
      klant: {
        id: klant_id,
        vnaam,
        lnaam,
      },
    } as Inschrijving;
  },

  createInschrijving: async (klant_id, training, inschrijving, session) => {
    const { inschrijvingCollection, klantCollection, trainingCollection } =
      getCollections(["klant", "training", "inschrijving"]);
    try {
      const { insertedId } = await inschrijvingCollection.insertOne(
        inschrijving,
        { session }
      );
      await klantCollection.updateOne(
        { _id: new ObjectId(klant_id) },
        { $addToSet: { inschrijvingen: insertedId } },
        { session }
      );
      await trainingCollection.updateOne(
        { naam: training },
        { $addToSet: { inschrijvingen: insertedId } },
        { session }
      );
      return true;
    } catch (e: any) {
      console.log(e.message);
      return false;
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

  trainingEnKlantGevonden: async (req) => {
    const { training, klant_id } = req.body;
    const klantGevonden = await findOneBy(client, "klant", {
      _id: new ObjectId(klant_id),
    });
    const trainingGevonden = await findOneBy(client, "training", {
      naam: training,
    });

    if (!klantGevonden && !trainingGevonden) return false;
    return true;
  },
};

export const {
  handleInschrijving,
  isPlaatsVrij,
  reedsIngeschreven,
  createInschrijvingDocument,
  createInschrijving,
  startTransaction,
  trainingEnKlantGevonden,
} = inschrijvingsHandler;
