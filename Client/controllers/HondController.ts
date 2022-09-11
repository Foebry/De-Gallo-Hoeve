import moment from "moment";
import { ObjectId } from "mongodb";
import {
  HondNotFoundError,
  InternalServerError,
} from "../middleware/RequestError";
import { HondCollection, UpdateHond } from "../types/EntityTpes/HondTypes";
import {
  getAllKlanten,
  getKlantById,
  getKlantCollection,
} from "./KlantController";

export interface IsHondController {
  saveHondForKlant: (
    klant_id: ObjectId,
    hond: HondCollection
  ) => Promise<HondCollection>;
  getHondenByKlantId: (klant_id: ObjectId) => Promise<HondCollection[]>;
  getAllHonden: () => Promise<HondCollection[]>;
  getKlantHond: (
    klant_id: ObjectId,
    hond_id: ObjectId
  ) => Promise<HondCollection>;
  update: (
    klant_id: ObjectId,
    _id: ObjectId,
    hondData: UpdateHond
  ) => Promise<HondCollection>;
  delete: (klant_id: ObjectId, _id: ObjectId) => Promise<void>;
}

const HondController: IsHondController = {
  saveHondForKlant: async (klant_id: ObjectId, hond: HondCollection) => {
    await getKlantById(klant_id);
    const { modifiedCount } = await getKlantCollection().updateOne(
      { _id: klant_id },
      { $addToSet: { honden: hond } }
    );
    if (modifiedCount !== 1) throw new InternalServerError();

    return hond;
  },
  getAllHonden: async () => {
    const klanten = await getAllKlanten();
    return klanten
      .map((klant) => klant.honden)
      .reduce((honden, hond) => [...honden, ...hond], []);
  },
  getHondenByKlantId: async (klant_id) => {
    const klant = await getKlantById(klant_id);
    return klant.honden;
  },
  getKlantHond: async (klant_id, _id) => {
    const klant = await getKlantById(klant_id);
    const hond = klant.honden.find((hond) => hond._id === _id);
    if (!hond) throw new HondNotFoundError();

    return hond;
  },
  update: async (klant_id, _id, hondData) => {
    const hond = await getKlantHond(klant_id, _id);
    const updateHond = {
      ...hond,
      hondData,
      updated_at: moment().local().format(),
    };

    const { upsertedCount } = await getKlantCollection().updateOne(
      { _id: klant_id, honden: { $elemMatch: { _id } } },
      { updateHond }
    );
    if (upsertedCount !== 1) throw new InternalServerError();

    return await getKlantHond(klant_id, hond._id);
  },
  delete: async (klant_id, _id) => {
    const hond = await getKlantHond(klant_id, _id);

    const { modifiedCount } = await getKlantCollection().updateOne(
      { _id: klant_id },
      { $pull: { honden: hond } }
    );
    if (modifiedCount !== 1) throw new InternalServerError();
  },
};

export default HondController;
export const { getKlantHond, getHondenByKlantId } = HondController;
export const HOND = "HondController";
