import { ClientSession, ObjectId } from "mongodb";
import { getCurrentTime } from "src/shared/functions";
import {
  CollectionOptions,
  getInschrijvingCollection,
  startSession,
  startTransaction,
} from "src/utils/db";
import {
  CASCADEFULL,
  CASCADEKLANT,
  CASCADETRAINING,
} from "../services/Factory";
import { InternalServerError, TransactionError } from "../shared/RequestError";
import { InschrijvingCollection } from "../types/EntityTpes/InschrijvingTypes";
import { addKlantInschrijving } from "./KlantController";
import {
  addInschrijving as addTrainingInschrijving,
  removeInschrijving as removeTrainingInschrijving,
} from "./TrainingController";

export const getAllInschrijvingen = async (
  options?: CollectionOptions
): Promise<InschrijvingCollection[]> => {
  const collection = await getInschrijvingCollection();
  const filter = options?.includeDeleted ? {} : { deleted_at: undefined } ?? {};
  return collection.find(filter).toArray();
};

export const getInschrijvingById = async (
  _id: ObjectId
): Promise<InschrijvingCollection | null> => {
  const collection = await getInschrijvingCollection();
  return collection.findOne({ _id, deleted_at: undefined });
};

export const getInschrijvingenByIds = async (
  ids: ObjectId[]
): Promise<InschrijvingCollection[]> => {
  const collection = await getInschrijvingCollection();
  return collection
    .find({ _id: { $in: ids }, deleted_at: undefined })
    .toArray();
};

export const save = async (
  inschrijving: InschrijvingCollection,
  session?: ClientSession
): Promise<InschrijvingCollection> => {
  const collection = await getInschrijvingCollection();

  const klant_id = inschrijving.klant.id;
  const training = inschrijving.training;

  const { insertedId } = await collection.insertOne(inschrijving, { session });
  if (!insertedId) throw new InternalServerError();

  await addKlantInschrijving(klant_id, inschrijving, session);
  await addTrainingInschrijving(training, inschrijving, session);

  return inschrijving;
};

const update = async (
  inschrijving: InschrijvingCollection,
  data: InschrijvingCollection
): Promise<InschrijvingCollection> => {
  const collection = await getInschrijvingCollection();

  const updateInschrijving = {
    ...inschrijving,
    datum: data.datum,
    updated_at: getCurrentTime(),
    hond: data.hond,
  };

  const session = await startSession();
  const transactionOptions = startTransaction();
  try {
    await session.withTransaction(async () => {
      const { upsertedCount } = await collection.updateOne(
        { _id: inschrijving._id },
        updateInschrijving
      );
      if (upsertedCount !== 1) throw new InternalServerError();

      // if inschrijving changed training
      if (inschrijving.training !== data.training) {
        removeTrainingInschrijving(
          inschrijving.training,
          inschrijving,
          session
        );
        addTrainingInschrijving(data.training, inschrijving, session);
      }
    }, transactionOptions);
  } catch (e: any) {
    throw new TransactionError(e.name, e.code, e.respose);
  }

  return updateInschrijving;
};

const hardDelete = async (
  inschrijving: InschrijvingCollection,
  cascade = CASCADEFULL
): Promise<void> => {
  const transactionOptions = startTransaction();
  const session = await startSession();

  try {
    await session.withTransaction(async () => {
      const collection = await getInschrijvingCollection();
      const klant_id = inschrijving.klant.id;
      const training = inschrijving.training;
      const { deletedCount } = await collection.deleteOne({
        _id: inschrijving._id,
      });

      if (deletedCount !== 1) throw new InternalServerError();

      if ([CASCADEKLANT, CASCADEFULL].includes(cascade))
        removeKlantInschrijving(klant_id, inschrijving._id, session);
      if ([CASCADETRAINING, CASCADEFULL].includes(cascade))
        removeTrainingInschrijving(training, inschrijving, session);
    }, transactionOptions);
  } catch (e: any) {
    throw new TransactionError(e.name, e.code, e.response);
  }
};

const softDelete = async (
  inschrijving: InschrijvingCollection
): Promise<void> => {
  const collection = await getInschrijvingCollection();
  const deletedInschrijving = { ...inschrijving, deleted_at: getCurrentTime() };

  const { modifiedCount } = await collection.updateOne(
    { _id: inschrijving._id },
    deletedInschrijving
  );
  if (modifiedCount !== 1) throw new InternalServerError();
};

const deleteAll = async (): Promise<void> => {
  const collection = await getInschrijvingCollection();
  if (process.env.NODE_ENV === "test") {
    collection.deleteMany({});
  }
};

const inschrijvingController: IsInschrijvingController = {
  getAllInschrijvingen,
  getInschrijvingById,
  getInschrijvingenByIds,
  save,
  update,
  hardDelete,
  softDelete,
  deleteAll,
};

export interface IsInschrijvingController {
  getAllInschrijvingen: () => Promise<InschrijvingCollection[]>;
  getInschrijvingById: (
    _id: ObjectId
  ) => Promise<InschrijvingCollection | null>;
  getInschrijvingenByIds: (
    ids: ObjectId[]
  ) => Promise<InschrijvingCollection[]>;
  save: (
    inschrijving: InschrijvingCollection,
    session?: ClientSession
  ) => Promise<InschrijvingCollection>;
  update: (
    inschrijving: InschrijvingCollection,
    update: InschrijvingCollection
  ) => Promise<InschrijvingCollection>;
  hardDelete: (
    inschrijving: InschrijvingCollection,
    cascade: string
  ) => Promise<void>;
  softDelete: (inschrijving: InschrijvingCollection) => Promise<void>;
  deleteAll: () => Promise<void>;
}

export const INSCHRIJVING = "InschrijvingController";

export default inschrijvingController;
function removeKlantInschrijving(
  klant_id: ObjectId,
  _id: ObjectId,
  session: ClientSession
) {
  throw new Error("Function not implemented.");
}
