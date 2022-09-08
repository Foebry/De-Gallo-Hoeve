import moment from "moment";
import { ObjectId } from "mongodb";
import {
  getAllKlanten,
  getKlantById,
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
  klant_id: ObjectId,
  hondData: NewHond
): Promise<HondCollection> => {
  const klant = await getKlantById(klant_id);
  const newHond = {
    ...hondData,
    created_at: moment().local().format(),
    _id: new ObjectId(),
  };

  const updateKlantData = {
    ...klant,
    honden: [...klant.honden, newHond],
  } as UpdateKlant;
  const updatedKlant = await updateKlant(klant_id, updateKlantData);

  const lastHondIndex = updatedKlant.honden.length - 1;
  const hond = updatedKlant.honden[lastHondIndex];

  return hond;
};

export const getHondenByKlantId = async (
  klant_id: ObjectId
): Promise<HondCollection[]> => {
  const klant = await getKlantById(klant_id);

  return klant.honden;
};

export const getAllHonden = async (): Promise<HondCollection[]> => {
  const klanten = await getAllKlanten();
  const klantHonden = klanten.map((klant) => klant.honden);
  const honden = klantHonden.reduce((prev, curr) => {
    return [...prev, ...curr];
  }, []);

  return honden;
};

export const getSpecificHond = async (
  klant_id: ObjectId,
  hond_id: ObjectId
): Promise<HondCollection> => {
  const { honden } = await getKlantById(klant_id);

  return honden.filter((hond) => hond._id === hond_id)[0];
};

export const updateKlantHond = async (
  klant_id: ObjectId,
  hond_id: ObjectId,
  hondData: UpdateHond
): Promise<HondCollection> => {
  const klant = await getKlantById(klant_id);
  const hond = klant.honden.filter((hond) => hond._id === hond_id)[0];

  const filteredHonden = klant.honden.filter((hond) => hond._id !== hond_id);
  const updateHond = { ...hond, ...hondData } as HondCollection;

  const updatedHonden = [...filteredHonden, updateHond];
  const updatedKlant = { ...klant, honden: updatedHonden };

  await updateKlant(klant_id, updatedKlant);
  const honden = await getHondenByKlantId(klant_id);

  const updatedHond = honden.filter((hond) => hond._id === hond_id)[0];

  return updatedHond;
};

export const removeHondFormKlant = async (
  klant_id: ObjectId,
  hond_id: ObjectId
): Promise<void> => {
  const klant = await getKlantById(klant_id);
  const updatedHonden = klant.honden.filter((hond) => hond._id !== hond_id);
  const updatedKlant = { ...klant, honden: updatedHonden };
  await updateKlant(klant_id, updatedKlant);
};
