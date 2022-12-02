import moment from "moment";
import { ObjectId } from "mongodb";
import {
  HondNotFoundError,
  InternalServerError,
  KlantNotFoundError,
} from "../middlewares/RequestError";
import { HondCollection, KlantHond } from "../types/EntityTpes/HondTypes";
import { IsKlantCollection } from "../types/EntityTpes/KlantTypes";
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
    klant: IsKlantCollection,
    hond_id: ObjectId
  ) => Promise<HondCollection>;
  update: (
    klant: IsKlantCollection,
    _id: ObjectId,
    hondData: HondCollection
  ) => Promise<HondCollection>;
  delete: (klant: IsKlantCollection, _id: ObjectId) => Promise<void>;
  getHondById: (_id: ObjectId) => Promise<void | HondCollection>;
  getAllKlantHonden: () => Promise<KlantHond[]>;
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
  getAllKlantHonden: async () => {
    const klanten = await getAllKlanten();
    return klanten
      .map((klant) =>
        klant.honden.map((hond) => ({
          ...hond,
          klant: {
            _id: klant._id,
            naam: [klant.vnaam, klant.lnaam].join(" "),
          },
        }))
      )
      .reduce((honden, hond) => [...honden, ...hond], []);
  },
  getHondenByKlantId: async (klant_id) => {
    const klant = await getKlantById(klant_id);
    if (!klant) throw new KlantNotFoundError();
    return klant.honden;
  },
  getKlantHond: async (klant, _id) => {
    const klantHond = klant.honden.find(
      (hond) => hond._id.toString() === _id.toString()
    );
    if (!klantHond) throw new HondNotFoundError();

    return klantHond;
  },
  update: async (klant, _id, hondData) => {
    const updateHond = {
      ...hondData,
      updated_at: moment().local().toDate(),
    };

    const { upsertedCount } = await getKlantCollection().updateOne(
      { _id: klant._id, honden: { $elemMatch: { _id } } },
      { updateHond }
    );
    if (upsertedCount !== 1) throw new InternalServerError();

    return updateHond;
  },
  delete: async (klant, _id) => {
    const hond = await getKlantHond(klant, _id);

    const { modifiedCount } = await getKlantCollection().updateOne(
      { _id: klant._id },
      { $pull: { honden: hond } }
    );
    if (modifiedCount !== 1) throw new InternalServerError();
  },
  getHondById: async (_id) => {
    const honden = await HondController.getAllHonden();
    return honden.find((hond) => hond._id.toString() === _id.toString());
  },
};

export default HondController;
export const {
  getKlantHond,
  getHondenByKlantId,
  getHondById,
  getAllKlantHonden,
} = HondController;
export const HOND = "HondController";
