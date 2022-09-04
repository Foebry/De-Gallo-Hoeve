import moment from "moment";
import { ClientSession, MongoClient, ObjectId } from "mongodb";
import {
  getAllKlanten,
  getKlantById,
  getKlantCollection,
  UpdateKlant,
  updateKlant,
} from "./KlantController";

export type Geslacht = "Teef" | "Reu";

export interface HondCollection {
  _id: ObjectId;
  geslacht: Geslacht;
  geboortedatum: Date;
  naam: string;
  ras: string;
  created_at: Date;
}

interface NewHond {
  geslacht: Geslacht;
  geboortedatum: Date;
  naam: string;
  ras: string;
}

interface UpdateHond {
  geslacht?: Geslacht;
  geboortedatum?: Date;
  naam?: string;
  ras?: string;
}

export const createNewHondForKlant = async (
  client: MongoClient,
  klant_id: ObjectId,
  hondData: NewHond
): Promise<HondCollection> => {
  const klant = await getKlantById(client, klant_id);
  const newHond = {
    ...hondData,
    created_at: moment().local().format(),
    _id: new ObjectId(),
  };

  const updateKlantData = {
    ...klant,
    honden: [...klant.honden, newHond],
  } as UpdateKlant;
  const updatedKlant = await updateKlant(client, klant_id, updateKlantData);

  const lastHondIndex = updatedKlant.honden.length - 1;
  const hond = updatedKlant.honden[lastHondIndex];

  return hond;
};

export const getHondenByKlantId = async (
  client: MongoClient,
  klant_id: ObjectId
): Promise<HondCollection[]> => {
  const klant = await getKlantById(client, klant_id);

  return klant.honden;
};

export const getAllHonden = async (
  client: MongoClient
): Promise<HondCollection[]> => {
  const klanten = await getAllKlanten(client);
  const klantHonden = klanten.map((klant) => klant.honden);
  const honden = klantHonden.reduce((prev, curr) => {
    return [...prev, ...curr];
  }, []);

  return honden;
};

export const getSpecificHond = async (
  client: MongoClient,
  klant_id: ObjectId,
  hond_id: ObjectId
): Promise<HondCollection> => {
  const { honden } = await getKlantById(client, klant_id);

  return honden.filter((hond) => hond._id === hond_id)[0];
};

export const updateKlantHond = async (
  client: MongoClient,
  klant_id: ObjectId,
  hond_id: ObjectId,
  hondData: UpdateHond
): Promise<HondCollection> => {
  const klant = await getKlantById(client, klant_id);
  const hond = klant.honden.filter((hond) => hond._id === hond_id)[0];

  const filteredHonden = klant.honden.filter((hond) => hond._id !== hond_id);
  const updateHond = { ...hond, ...hondData } as HondCollection;

  const updatedHonden = [...filteredHonden, updateHond];
  const updatedKlant = { ...klant, honden: updatedHonden };

  await updateKlant(client, klant_id, updatedKlant);
  const honden = await getHondenByKlantId(client, klant_id);

  const updatedHond = honden.filter((hond) => hond._id === hond_id)[0];

  return updatedHond;
};

export const removeHondFormKlant = async (
  client: MongoClient,
  klant_id: ObjectId,
  hond_id: ObjectId
): Promise<void> => {
  const klant = await getKlantById(client, klant_id);
  const updatedHonden = klant.honden.filter((hond) => hond._id !== hond_id);
  const updatedKlant = { ...klant, honden: updatedHonden };
  await updateKlant(client, klant_id, updatedKlant);
};
