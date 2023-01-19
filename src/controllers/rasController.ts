import { ObjectId } from "mongodb";
import { InternalServerError } from "../shared/RequestError";
import { RasCollection } from "../types/EntityTpes/RasTypes";
import { getRasCollection } from "src/utils/db";
import { getCurrentTime } from "src/shared/functions";

export const getRasByName = async (
  naam: string
): Promise<RasCollection | null> => {
  const collection = await getRasCollection();
  return collection.findOne({ naam });
};

export const save = async (ras: RasCollection): Promise<RasCollection> => {
  const collection = await getRasCollection();
  const { insertedId } = await collection.insertOne(ras);
  if (!insertedId) throw new InternalServerError();

  return ras;
};

export const getRasById = async (
  _id: ObjectId
): Promise<RasCollection | null> => {
  const collection = await getRasCollection();

  return collection.findOne({ _id });
};

export const getAllRassen = async (): Promise<RasCollection[]> => {
  const collection = await getRasCollection();
  return collection.find({ deleted_at: undefined }).toArray();
};

export const update = async (
  _id: ObjectId,
  data: RasCollection
): Promise<RasCollection> => {
  const collection = await getRasCollection();

  const updateRas = { ...data, updated_at: getCurrentTime() };

  const { upsertedCount } = await collection.updateOne({ _id }, updateRas);
  if (upsertedCount !== 1) throw new InternalServerError();

  return data;
};

export const hardDelete = async (ras: RasCollection): Promise<void> => {
  const collection = await getRasCollection();
  const { deletedCount } = await collection.deleteOne(ras);
  if (!deletedCount) throw new InternalServerError();
};

export const softDelete = async (ras: RasCollection): Promise<void> => {
  const collection = await getRasCollection();
  const deleteRas = { ...ras, deleted_at: getCurrentTime() };

  const { upsertedCount } = await collection.updateOne(
    { _id: ras._id },
    deleteRas
  );
  if (upsertedCount !== 1) throw new InternalServerError();
};

export const deleteAll = async (): Promise<void> => {
  const collection = await getRasCollection();

  collection.deleteMany({});
};

export const getRandomRasNaam = async (): Promise<string> => {
  const rassen = await getAllRassen();
  const random = Math.floor(Math.random() * rassen.length);
  return rassen[random].naam;
};

export const RAS = "RasController";

const rasController: IsRasController = {
  getRandomRasNaam,
  deleteAll,
  hardDelete,
  softDelete,
  update,
  getAllRassen,
  getRasById,
  getRasByName,
  save,
};

export type IsRasController = {
  getRandomRasNaam: () => Promise<string>;
  deleteAll: () => Promise<void>;
  hardDelete: (ras: RasCollection) => Promise<void>;
  softDelete: (ras: RasCollection) => Promise<void>;
  update: (_id: ObjectId, data: RasCollection) => Promise<RasCollection>;
  getAllRassen: () => Promise<RasCollection[]>;
  getRasById: (_id: ObjectId) => Promise<RasCollection | null>;
  getRasByName: (naam: string) => Promise<RasCollection | null>;
  save: (ras: RasCollection) => Promise<RasCollection>;
};

export default rasController;
