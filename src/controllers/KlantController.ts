import { ClientSession, ObjectId, WithId } from "mongodb";
import inschrijvingController, {
  getAllInschrijvingen,
} from "./InschrijvingController";
import { InternalServerError, TransactionError } from "../shared/RequestError";
import { IsKlantCollection } from "../types/EntityTpes/KlantTypes";
import { InschrijvingCollection } from "../types/EntityTpes/InschrijvingTypes";
import { HondCollection } from "src/types/EntityTpes/HondTypes";
import { getKlantCollection } from "src/utils/db";
import { getCurrentTime } from "src/shared/functions";
import bcrypt from "bcrypt";

export const getAllKlanten = async (): Promise<IsKlantCollection[]> => {
  const collection = await getKlantCollection();
  return collection.find({ deleted_at: undefined }).toArray();
};

export const getKlantById = async (
  _id: ObjectId,
  includeDeleted: boolean = true
): Promise<IsKlantCollection | null> => {
  const collection = await getKlantCollection();
  const filter = includeDeleted ? { _id } : { _id, deleted_at: undefined };
  return collection.findOne(filter);
};

export const getKlantByEmail = async (
  email: string
): Promise<WithId<IsKlantCollection> | null> => {
  const collection = await getKlantCollection();
  return collection.findOne({ email });
};

export const getHondOwner = async (
  hond: HondCollection
): Promise<IsKlantCollection | null> => {
  const collection = await getKlantCollection();
  return collection.findOne({
    honden: { $elemMatch: { _id: hond._id } },
  });
};

export const save = async (
  klant: IsKlantCollection
): Promise<IsKlantCollection> => {
  const collection = await getKlantCollection();
  const { insertedId } = await collection.insertOne({
    ...klant,
    password: await bcrypt.hash(klant.password, 10),
  });
  if (!insertedId) throw new InternalServerError();

  return klant;
};

export const update = async (
  _id: ObjectId,
  data: IsKlantCollection
): Promise<IsKlantCollection> => {
  const collection = await getKlantCollection();
  const { upsertedCount } = await collection.updateOne({ _id }, data);
  if (upsertedCount !== 1) throw new InternalServerError();

  return data;
};

export const addKlantInschrijving = async (
  _id: ObjectId,
  inschrijving: InschrijvingCollection,
  session?: ClientSession
): Promise<void> => {
  const collection = await getKlantCollection();
  try {
    await collection.updateOne(
      { _id },
      {
        $addToSet: { inschrijvingeng: inschrijving._id },
        $set: { updated_at: getCurrentTime() },
      },
      { session }
    );
  } catch (e: any) {
    throw new TransactionError("addKlantInschrijving", 500, {
      ...e,
      message: "Er is iets fout gegaan.",
    });
  }
};

export const hardDelete = async (klant: IsKlantCollection): Promise<void> => {
  const collection = await getKlantCollection();

  const inschrijvingen = await getAllInschrijvingen({ includeDeleted: true });
  const klantInschrijvingen = inschrijvingen.filter(
    (inschrijving) => inschrijving.klant.id === klant._id
  );

  await Promise.all(
    klantInschrijvingen.map((inschrijving) =>
      inschrijvingController.softDelete(inschrijving)
    )
  );

  const { deletedCount } = await collection.deleteOne(klant);
  if (deletedCount !== 1) throw new InternalServerError();
};

export const setVerified = async (
  klant: IsKlantCollection
): Promise<IsKlantCollection> => {
  const collection = await getKlantCollection();
  const verified = true;
  const verified_at = getCurrentTime();

  const { modifiedCount } = await collection.updateOne(
    { _id: klant._id },
    { $set: { verified, verified_at } }
  );
  if (modifiedCount !== 1) throw new InternalServerError();

  return { ...klant, verified, verified_at };
};

export const removeInschrijving = async (
  klant_id: ObjectId,
  inschrijving_id: ObjectId,
  session: ClientSession
): Promise<void> => {
  const collection = await getKlantCollection();
  const { modifiedCount } = await collection.updateOne(
    { _id: klant_id },
    { $pull: { inschrijvingen: inschrijving_id } },
    { session }
  );
  if (modifiedCount !== 1) throw new InternalServerError();
};

export const deleteAll = async (): Promise<void> => {
  const collection = await getKlantCollection();

  if (process.env.NODE_ENV === "test") {
    collection.deleteMany({});
  }
};

export const KLANT = "KlantController";

const klantController: IsKlantController = {
  deleteAll,
  removeInschrijving,
  setVerified,
  hardDelete,
  addKlantInschrijving,
  update,
  save,
  getHondOwner,
  getKlantByEmail,
  getKlantById,
  getAllKlanten,
};

export type IsKlantController = {
  deleteAll: () => Promise<void>;
  removeInschrijving: (
    klant_id: ObjectId,
    inschrijving_id: ObjectId,
    session: ClientSession
  ) => Promise<void>;
  setVerified: (klant: IsKlantCollection) => Promise<IsKlantCollection>;
  hardDelete: (klant: IsKlantCollection) => Promise<void>;
  addKlantInschrijving: (
    klant_id: ObjectId,
    inschrijving: InschrijvingCollection,
    session: ClientSession
  ) => Promise<void>;
  update: (
    _id: ObjectId,
    data: IsKlantCollection
  ) => Promise<IsKlantCollection>;
  save: (klant: IsKlantCollection) => Promise<IsKlantCollection>;
  getHondOwner: (hond: HondCollection) => Promise<IsKlantCollection | null>;
  getKlantByEmail: (email: string) => Promise<IsKlantCollection | null>;
  getKlantById: (_id: ObjectId) => Promise<IsKlantCollection | null>;
  getAllKlanten: () => Promise<IsKlantCollection[]>;
};

export default klantController;
