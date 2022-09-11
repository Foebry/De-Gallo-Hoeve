import moment from "moment";
import { ClientSession, Collection, ObjectId } from "mongodb";
import {
  deleteInschrijvingen,
  getInschrijvingById,
} from "./InschrijvingController";
import client from "../middleware/MongoDb";
import {
  InternalServerError,
  KlantNotFoundError,
} from "../middleware/RequestError";
import { CASCADETRAINING } from "../middleware/Factory";
import { IsKlantCollection } from "../types/EntityTpes/KlantTypes";
import { InschrijvingCollection } from "../types/EntityTpes/InschrijvingTypes";

export interface IsKlantController {
  getKlantCollection: () => Collection;
  getAllKlanten: () => Promise<IsKlantCollection[]>;
  getKlantById: (_id: ObjectId) => Promise<IsKlantCollection>;
  getKlantByEmail: (email: string) => Promise<IsKlantCollection | null>;
  save: (klant: IsKlantCollection) => Promise<IsKlantCollection>;
  update: (
    _id: ObjectId,
    klant: IsKlantCollection
  ) => Promise<IsKlantCollection>;
  addKlantInschrijving: (
    _id: ObjectId,
    inschrijving: InschrijvingCollection,
    session: ClientSession
  ) => Promise<void>;
  delete: (klant: IsKlantCollection) => Promise<void>;
  setVerified: (_id: ObjectId) => Promise<void>;
  removeInschrijving: (
    _id: ObjectId,
    inschrijving_id: ObjectId,
    session?: ClientSession
  ) => Promise<void>;
}

const KlantController: IsKlantController = {
  getKlantCollection: () => client.db("degallohoeve").collection("klant"),
  getAllKlanten: async () => {
    return (await getKlantCollection().find().toArray()) as IsKlantCollection[];
  },
  getKlantById: async (_id) => {
    const klant = await getKlantCollection().findOne({ _id });
    if (!klant) throw new KlantNotFoundError();
    return klant as IsKlantCollection;
  },
  getKlantByEmail: async (email) => {
    return (await getKlantCollection().findOne({ email })) as IsKlantCollection;
  },
  save: async (klant) => {
    const { insertedId } = await getKlantCollection().insertOne(klant);
    if (!insertedId) throw new InternalServerError();
    return await getKlantById(insertedId);
  },
  update: async (_id, updateKlant) => {
    await getKlantById(_id);
    const { upsertedCount } = await getKlantCollection().updateOne(
      { _id },
      updateKlant
    );
    if (upsertedCount !== 1) throw new InternalServerError();
    return await getKlantById(_id);
  },
  addKlantInschrijving: async (_id, inschrijving, session) => {
    await getKlantById(_id);
    const { modifiedCount } = await getKlantCollection().updateOne(
      { _id },
      { $addToSet: { inschrijvingen: inschrijving } }
    );
    if (modifiedCount !== 1) throw new InternalServerError();
  },
  delete: async (klant) => {
    await getKlantById(klant._id);
    const { deletedCount } = await getKlantCollection().deleteOne(klant);
    if (deletedCount !== 1) throw new InternalServerError();
    const inschrijvingen = await Promise.all(
      klant.inschrijvingen.map(
        async (_id) => await getInschrijvingById(_id, false)
      )
    );
    await deleteInschrijvingen(inschrijvingen, CASCADETRAINING);
  },
  setVerified: async (_id) => {
    const klant = await getKlantById(_id);
    klant.verified = true;
    klant.verified_at = moment().local().format();
    await updateKlant(_id, klant);
  },
  removeInschrijving: async (_id, inschrijving_id, session) => {
    await getKlantById(_id);
    await getInschrijvingById(inschrijving_id);
    await getKlantCollection().updateOne(
      { _id },
      { $pull: { inschrijvingen: inschrijving_id } },
      { session }
    );
  },
};

export default KlantController;
export const KLANT = "KlantController";
export const {
  getKlantCollection,
  getKlantById,
  getKlantByEmail,
  getAllKlanten,
  update: updateKlant,
  addKlantInschrijving,
  removeInschrijving: removeKlantInschrijving,
} = KlantController;
