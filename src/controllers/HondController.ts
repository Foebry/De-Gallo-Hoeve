import { ObjectId } from "mongodb";
import { getCurrentTime } from "src/shared/functions";
import { getKlantCollection } from "src/utils/db";
import { InternalServerError } from "../shared/RequestError";
import { HondCollection } from "../types/EntityTpes/HondTypes";
import { IsKlantCollection } from "../types/EntityTpes/KlantTypes";
import { getAllKlanten, getKlantById } from "./KlantController";

const save = async (
  klant: IsKlantCollection,
  hond: HondCollection
): Promise<HondCollection> => {
  const klantCollection = await getKlantCollection();
  const { modifiedCount } = await klantCollection.updateOne(
    { _id: klant._id },
    { $addToSet: { honden: hond } }
  );
  if (modifiedCount !== 1) throw new InternalServerError();

  return hond;
};

const getAllHonden = async (): Promise<HondCollection[]> => {
  const klanten = await getAllKlanten();
  return klanten
    .map((klant) => klant.honden)
    .reduce((honden, hond) => [...honden, ...hond], [])
    .filter((hond) => !hond.deleted_at);
};

export const getHondenByKlantId = async (
  klant_id: ObjectId
): Promise<HondCollection[]> => {
  const klant = await getKlantById(klant_id);
  return klant?.honden.filter((hond) => !hond.deleted_at) ?? [];
};

export const getKlantHond = async (
  klant_id: ObjectId,
  hond_id: ObjectId
): Promise<HondCollection | null> => {
  const klant = await getKlantById(klant_id);
  if (!klant) return null;
  const hond = klant.honden.find(
    (hond) => hond._id.toString() === hond_id.toString() && !hond.deleted_at
  );
  return hond ?? null;
};

const update = async (
  klant: IsKlantCollection,
  hond_id: ObjectId,
  data: HondCollection
): Promise<HondCollection> => {
  const klantCollection = await getKlantCollection();
  const updateHond = { ...data, updated_at: getCurrentTime() };

  const { upsertedCount } = await klantCollection.updateOne(
    { _id: klant._id, honden: { $elemMatch: { _id: hond_id } } },
    updateHond
  );
  if (upsertedCount !== 1) throw new InternalServerError();

  return updateHond;
};

const hardDelete = async (
  klant: IsKlantCollection,
  hond: HondCollection
): Promise<void> => {
  const klantCollection = await getKlantCollection();

  const { modifiedCount } = await klantCollection.updateOne(
    { _id: klant._id },
    { $pull: { honden: hond } }
  );
  if (modifiedCount !== 1) throw new InternalServerError();
};

const softDelete = async (
  klant: IsKlantCollection,
  hond: HondCollection
): Promise<void> => {
  const klantCollection = await getKlantCollection();

  const deletedHond = { ...hond, deleted_at: getCurrentTime() };

  const { modifiedCount } = await klantCollection.updateOne(
    { _id: klant._id, honden: { $elemMatch: { _id: hond._id } } },
    deletedHond
  );
  if (modifiedCount !== 1) throw new InternalServerError();
};

export const getHondById = async (
  _id: ObjectId
): Promise<HondCollection | null> => {
  const collection = await getKlantCollection();
  const klant = await collection.findOne({ honden: { $elemMatch: { _id } } });
  return (
    klant?.honden.find(
      (hond) => hond._id.toString() === _id.toString() && !hond.deleted_at
    ) ?? null
  );
};

const hondController: IsHondController = {
  getHondById,
  softDelete,
  hardDelete,
  update,
  getKlantHond,
  getHondenByKlantId,
  getAllHonden,
  save,
};

export type IsHondController = {
  getHondById: (_id: ObjectId) => Promise<HondCollection | null>;
  softDelete: (klant: IsKlantCollection, hond: HondCollection) => Promise<void>;
  hardDelete: (klant: IsKlantCollection, hond: HondCollection) => Promise<void>;
  update: (
    klant: IsKlantCollection,
    _id: ObjectId,
    hondData: HondCollection
  ) => Promise<HondCollection>;
  getKlantHond: (
    klant_id: ObjectId,
    hond_id: ObjectId
  ) => Promise<HondCollection | null>;
  getHondenByKlantId: (klant_id: ObjectId) => Promise<HondCollection[]>;
  getAllHonden: () => Promise<HondCollection[]>;
  save: (
    klant: IsKlantCollection,
    hond: HondCollection
  ) => Promise<HondCollection>;
};

export default hondController;
export const HOND = "HondController";
