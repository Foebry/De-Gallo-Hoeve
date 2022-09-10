import { ClientSession, Collection, ObjectId } from "mongodb";
import {
  CASCADEFULL,
  CASCADEKLANT,
  CASCADETRAINING,
} from "../middleware/Factory";
import client, { startTransaction } from "../middleware/MongoDb";
import {
  InschrijvingKlantChangedError,
  InschrijvingNotFoundError,
  InternalServerError,
} from "../middleware/RequestError";
import { Geslacht, getKlantHond } from "./HondController";
import {
  addKlantInschrijving,
  getKlantById,
  removeKlantInschrijving,
} from "./KlantController";
import {
  addTrainingInschrijving,
  deleteInschrijving,
  getTrainingByName,
  TrainingType,
} from "./TrainingController";

export interface IsInschrijving {
  datum: string;
  hond_id: string;
  hond_naam: string;
  hond_geslacht: Geslacht;
}

export interface InschrijvingBodyInterface {
  inschrijvingen: IsInschrijving[];
  training: TrainingType;
  klant_id: string;
}

export interface NewInschrijving {
  datum: string;
  training: TrainingType;
  hond: {
    id: ObjectId;
    naam: string;
  };
  klant: {
    id: ObjectId;
    vnaam: string;
    lnaam: string;
  };
}

export interface InschrijvingCollection extends NewInschrijving {
  _id: ObjectId;
  created_at: string;
}

interface UpdateInschrijving {
  datum?: string;
  training?: TrainingType;
  hond?: {
    id: ObjectId;
    naam: string;
  };
}

export interface IsInschrijvingController {
  getInschrijvingCollection: () => Collection;
  saveInschrijving: (
    inschrijving: InschrijvingCollection,
    session: ClientSession
  ) => Promise<InschrijvingCollection>;
  getAllInschrijvingen: () => Promise<InschrijvingCollection[]>;
  getInschrijvingById: (
    _id: ObjectId,
    breakEarly?: boolean
  ) => Promise<InschrijvingCollection>;
  getInschrijvingenByFilter: (filter: any) => Promise<InschrijvingCollection[]>;
  updateInschrijving: (
    _id: ObjectId,
    inschrijving: InschrijvingCollection
  ) => Promise<InschrijvingCollection>;
  deleteInschrijving: (_id: ObjectId, cascade: string) => Promise<void>;
  deleteInschrijvingen: (
    inschrijvingen: InschrijvingCollection[],
    cascade: string
  ) => Promise<void>;
}

const InschrijvingController: IsInschrijvingController = {
  getInschrijvingCollection: () =>
    client.db("degallohoeve").collection("inschrijving"),
  saveInschrijving: async (inschrijving, session) => {
    const klant = await getKlantById(inschrijving.klant.id);
    const training = await getTrainingByName(inschrijving.training);
    await getKlantHond(klant._id, inschrijving.hond.id);

    const { insertedId } = await getInschrijvingCollection().insertOne(
      inschrijving,
      { session }
    );
    if (!insertedId) throw new InternalServerError();

    await addKlantInschrijving(klant._id, inschrijving, session);
    await addTrainingInschrijving(training.naam, inschrijving, session);

    return getInschrijvingById(inschrijving._id);
  },
  getAllInschrijvingen: async () => {
    return (await getInschrijvingCollection()
      .find()
      .toArray()) as InschrijvingCollection[];
  },
  getInschrijvingById: async (_id, breakEarly = true) => {
    const inschrijving = (await getInschrijvingCollection().findOne({
      _id,
    })) as InschrijvingCollection;
    if (!inschrijving && breakEarly) throw new InschrijvingNotFoundError();
    return inschrijving;
  },
  getInschrijvingenByFilter: async (filter) => {
    return (await getInschrijvingCollection()
      .find(filter)
      .toArray()) as InschrijvingCollection[];
  },
  updateInschrijving: async (_id, updateInschrijving) => {
    const inschrijving = await getInschrijvingById(_id);
    const collection = getInschrijvingCollection();
    await getKlantHond(updateInschrijving.klant.id, updateInschrijving.hond.id);
    await getTrainingByName(updateInschrijving.training);

    if (inschrijving.klant !== updateInschrijving.klant)
      throw new InschrijvingKlantChangedError();

    const { upsertedCount } = await collection.updateOne(
      { _id },
      updateInschrijving
    );
    if (upsertedCount !== 1) throw new InternalServerError();

    if (inschrijving.training !== updateInschrijving.training) {
      deleteInschrijving(inschrijving.training, inschrijving._id);
      addTrainingInschrijving(updateInschrijving.training, inschrijving);
    }

    return await getInschrijvingById(updateInschrijving._id);
  },
  deleteInschrijving: async (_id, cascade = "full") => {
    const inschrijving = await getInschrijvingById(_id);
    const transactionOptions = startTransaction();
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        const collection = getInschrijvingCollection();
        const klant_id = inschrijving.klant.id;
        const training = inschrijving.training;
        const { deletedCount } = await collection.deleteOne({ _id });

        if (deletedCount !== 1) throw new InternalServerError();

        if ([CASCADEKLANT, CASCADEFULL].includes(cascade))
          removeKlantInschrijving(klant_id, _id, session);
        if ([CASCADETRAINING, CASCADEFULL].includes(cascade))
          deleteInschrijving(training, _id, session);
      }, transactionOptions);
    } catch (e: any) {
      session.abortTransaction();
      throw new InternalServerError();
    }
  },
  deleteInschrijvingen: async (inschrijvingen, cascade = CASCADEFULL) => {
    const transactionOptions = startTransaction();
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        await getInschrijvingCollection().deleteMany(inschrijvingen);
        await Promise.all(
          inschrijvingen.map(({ _id, training, klant: { id: klant_id } }) => {
            if ([CASCADEKLANT, CASCADEFULL].includes(cascade))
              removeKlantInschrijving(klant_id, _id, session);
            if ([CASCADETRAINING, CASCADEFULL].includes(cascade))
              deleteInschrijving(training, _id, session);
          })
        );
      }, transactionOptions);
    } catch (e: any) {
      session.abortTransaction();
      throw new InternalServerError();
    }
  },
};

export default InschrijvingController;
export const {
  getInschrijvingCollection,
  getInschrijvingById,
  deleteInschrijvingen,
  saveInschrijving,
} = InschrijvingController;

// export const createNewInschrijving = (
//   inschrijving: IsInschrijving,
//   training: TrainingType,
//   klant: KlantCollection,
//   hond: HondCollection
// ): NewInschrijving => {
//   return {
//     datum: inschrijving.datum,
//     training,
//     hond: {
//       id: hond._id,
//       naam: hond.naam,
//     },
//     klant: {
//       id: klant._id,
//       lnaam: klant.lnaam,
//       vnaam: klant.vnaam,
//     },
//   };
// };
