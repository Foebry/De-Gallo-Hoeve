import { ObjectId } from 'mongodb';
import { getCurrentTime } from 'src/shared/functions';
import { getKlantCollection } from 'src/utils/db';
import { Option } from 'src/utils/MongoDb';
import { InternalServerError } from '../shared/RequestError';
import { HondCollection, KlantHond } from '../types/EntityTpes/HondTypes';
import { IsKlantCollection } from '../types/EntityTpes/KlantTypes';
import { getAllKlanten, getKlantById } from './KlantController';

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

const getAllHonden = async (): Promise<KlantHond[]> => {
  const klanten = await getAllKlanten();
  return klanten
    .map((klant) =>
      klant.honden.map((hond) => ({
        ...hond,
        klant: { _id: klant._id, vnaam: klant.vnaam, lnaam: klant.lnaam },
      }))
    )
    .reduce((honden, hond) => [...honden, ...hond], [])
    .filter((klantHond) => !klantHond.deleted_at);
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

  const { modifiedCount } = await klantCollection.updateOne(
    { _id: klant._id, honden: { $elemMatch: { _id: hond_id } } },
    { $set: updateHond }
  );
  if (modifiedCount !== 1) throw new InternalServerError();

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

export const getHondById = async (_id: ObjectId): Promise<HondCollection | null> => {
  const collection = await getKlantCollection();
  const klant = await collection.findOne({ honden: { $elemMatch: { _id } } });
  return (
    klant?.honden.find(
      (hond) => hond._id.toString() === _id.toString() && !hond.deleted_at
    ) ?? null
  );
};

export const fullName = (klant: IsKlantCollection) => `${klant.vnaam} ${klant.lnaam}`;

const getHondOptions = async (klantId: ObjectId): Promise<Option[]> => {
  const honden = await getHondenByKlantId(klantId);
  return honden.map(({ _id: value, naam: label }) => ({
    value: value?.toString(),
    label,
  }));
};

const hondController: IsHondController = {
  getHondById,
  softDelete,
  hardDelete,
  update,
  getKlantHond,
  getHondOptions,
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
  getKlantHond: (klant_id: ObjectId, hond_id: ObjectId) => Promise<HondCollection | null>;
  getHondOptions: (klant_id: ObjectId) => Promise<Option[]>;
  getHondenByKlantId: (klant_id: ObjectId) => Promise<HondCollection[]>;
  getAllHonden: () => Promise<KlantHond[]>;
  save: (klant: IsKlantCollection, hond: HondCollection) => Promise<HondCollection>;
};

export default hondController;
export const HOND = 'HondController';
