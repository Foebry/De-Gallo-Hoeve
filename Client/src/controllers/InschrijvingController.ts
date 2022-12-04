import moment from "moment";
import { ClientSession, Collection, ObjectId } from "mongodb";
import {
  CASCADEFULL,
  CASCADEKLANT,
  CASCADETRAINING,
} from "../services/Factory";
import { getConnection, startTransaction } from "../utils/MongoDb";
import {
  InschrijvingKlantChangedError,
  InternalServerError,
  TransactionError,
} from "../shared/RequestError";
import { InschrijvingCollection } from "../types/EntityTpes/InschrijvingTypes";
import { IsKlantCollection } from "../types/EntityTpes/KlantTypes";
import { IsUpdateInschrijvingBody } from "../types/requestTypes";
import { getKlantHond } from "./HondController";
import {
  addKlantInschrijving,
  removeKlantInschrijving,
} from "./KlantController";
import {
  addTrainingInschrijving,
  deleteInschrijving,
  getTrainingByName,
} from "./TrainingController";

export const INSCHRIJVING = "InschrijvingController";

export interface IsInschrijvingController {
  getInschrijvingCollection: () => Promise<Collection>;
  saveInschrijving: (
    inschrijving: InschrijvingCollection,
    session: ClientSession
  ) => Promise<InschrijvingCollection>;
  getAllInschrijvingen: () => Promise<InschrijvingCollection[]>;
  getInschrijvingById: (
    _id: ObjectId,
    breakEarly?: boolean
  ) => Promise<InschrijvingCollection>;
  getInschrijvingenByIds: (
    ids: ObjectId[]
  ) => Promise<InschrijvingCollection[]>;
  getInschrijvingenByFilter: (filter: any) => Promise<InschrijvingCollection[]>;
  updateInschrijving: (
    _id: ObjectId,
    klant: IsKlantCollection,
    inschrijving: IsUpdateInschrijvingBody
  ) => Promise<InschrijvingCollection>;
  deleteInschrijving: (_id: ObjectId, cascade: string) => Promise<void>;
  deleteInschrijvingen: (
    inschrijvingen: InschrijvingCollection[],
    cascade: string
  ) => Promise<void>;
  deleteAll: () => Promise<void>;
}

const InschrijvingController: IsInschrijvingController = {
  getInschrijvingCollection: async () => {
    const database = process.env.MONGODB_DATABASE;
    const client = await getConnection();
    return client.db(database).collection("inschrijving");
  },
  saveInschrijving: async (inschrijving, session) => {
    const klant_id = inschrijving.klant.id;
    const training = inschrijving.training;
    const collection = await getInschrijvingCollection();
    const { insertedId } = await collection.insertOne(inschrijving, {
      session,
    });
    if (!insertedId) throw new InternalServerError();

    await addKlantInschrijving(klant_id, inschrijving, session);
    await addTrainingInschrijving(training, inschrijving, session);

    return getInschrijvingById(insertedId);
  },
  getAllInschrijvingen: async () => {
    const collection = await getInschrijvingCollection();
    return (await collection.find().toArray()) as InschrijvingCollection[];
  },
  getInschrijvingById: async (_id, breakEarly = true) => {
    const collection = await getInschrijvingCollection();
    const inschrijving = (await collection.findOne({
      _id,
    })) as InschrijvingCollection;
    return inschrijving;
  },
  getInschrijvingenByIds: async (ids) => {
    const collection = await getInschrijvingCollection();
    const inschrijvingen = await collection
      .find({ _id: { $in: ids } })
      .toArray();
    return inschrijvingen as InschrijvingCollection[];
  },

  getInschrijvingenByFilter: async (filter) => {
    const collection = await getInschrijvingCollection();
    return (await collection
      .find(filter)
      .toArray()) as InschrijvingCollection[];
  },
  updateInschrijving: async (_id, klant, updateData) => {
    const inschrijving = await getInschrijvingById(_id);
    const collection = await getInschrijvingCollection();
    const hond = await getKlantHond(klant, new ObjectId(updateData.hond_id));
    await getTrainingByName(updateData.training);
    const client = await getConnection();

    if (inschrijving.klant.id.toString() !== updateData.klant_id)
      throw new InschrijvingKlantChangedError();

    const updateInschrijving = {
      ...inschrijving,
      datum: updateData.datum,
      updated_at: moment().local().format(),
      hond: {
        id: hond._id,
        naam: hond.naam,
      },
    };
    const session = client.startSession();
    const transactionOptions = startTransaction();
    try {
      await session.withTransaction(async () => {
        const { upsertedCount } = await collection.updateOne(
          { _id },
          updateInschrijving
        );
        if (upsertedCount !== 1) throw new InternalServerError();

        if (inschrijving.training !== updateData.training) {
          deleteInschrijving(inschrijving.training, inschrijving._id);
          addTrainingInschrijving(updateData.training, inschrijving);
        }
      }, transactionOptions);
    } catch (e: any) {
      // await session.abortTransaction();
      throw new TransactionError(e.name, e.code, e.respose);
    }

    return await getInschrijvingById(_id);
  },
  deleteInschrijving: async (_id, cascade = "full") => {
    const client = await getConnection();
    const collection = await getInschrijvingCollection();
    const inschrijving = await getInschrijvingById(_id);
    const transactionOptions = startTransaction();
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
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
      // session.abortTransaction();
      throw new TransactionError(e.name, e.code, e.response);
    }
  },
  deleteInschrijvingen: async (inschrijvingen, cascade = CASCADEFULL) => {
    const client = await getConnection();
    const collection = await getInschrijvingCollection();
    const transactionOptions = startTransaction();
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        await collection.deleteMany(inschrijvingen);
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
      // session.abortTransaction();
      throw new TransactionError(e.name, e.code, e.response);
    }
  },
  deleteAll: async () => {
    const collection = await getInschrijvingCollection();
    const ids = (await collection.find().toArray()).map((item) => item._id);
    await collection.deleteMany({ _id: { $in: [...ids] } });
  },
};

export default InschrijvingController;
export const {
  getInschrijvingCollection,
  getInschrijvingById,
  deleteInschrijvingen,
  saveInschrijving,
  getInschrijvingenByIds,
} = InschrijvingController;
