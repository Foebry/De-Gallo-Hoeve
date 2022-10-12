import moment from "moment";
import { ClientSession, Collection, ObjectId } from "mongodb";
import {
  deleteInschrijvingen,
  getInschrijvingById,
} from "./InschrijvingController";
import client from "../middleware/MongoDb";
import {
  InschrijvingNotFoundError,
  InternalServerError,
  KlantNotFoundError,
} from "../middleware/RequestError";
import { CASCADETRAINING } from "../middleware/Factory";
import { IsKlantCollection } from "../types/EntityTpes/KlantTypes";
import { InschrijvingCollection } from "../types/EntityTpes/InschrijvingTypes";

export interface IsKlantController {
  getKlantCollection: () => Collection;
  getAllKlanten: () => Promise<IsKlantCollection[]>;
  getKlantById: (_id: ObjectId) => Promise<IsKlantCollection | null>;
  getKlantByEmail: (
    email: string,
    db?: any
  ) => Promise<IsKlantCollection | null>;
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
  setVerified: (klant: IsKlantCollection) => Promise<IsKlantCollection>;
  removeInschrijving: (
    _id: ObjectId,
    inschrijving_id: ObjectId,
    session?: ClientSession
  ) => Promise<void>;
  deleteAll: () => Promise<void>;
}

const KlantController: IsKlantController = {
  getKlantCollection: () => {
    const database = process.env.MONGODB_DATABASE;
    return client.db(database).collection("klant");
  },
  getAllKlanten: async () => {
    return (await getKlantCollection().find().toArray()) as IsKlantCollection[];
  },
  getKlantById: async (_id) => {
    const klant = await getKlantCollection().findOne({ _id });
    return klant as IsKlantCollection;
  },
  getKlantByEmail: async (email) => {
    return (await getKlantCollection().findOne({ email })) as IsKlantCollection;
  },
  save: async (klant) => {
    const { insertedId } = await getKlantCollection().insertOne(klant);
    if (!insertedId) throw new InternalServerError();
    return { ...klant, _id: insertedId };
  },
  update: async (_id, updateKlant) => {
    const { upsertedCount } = await getKlantCollection().updateOne(
      { _id },
      updateKlant
    );
    if (upsertedCount !== 1) throw new InternalServerError();
    return updateKlant;
  },
  addKlantInschrijving: async (_id, inschrijving, session) => {
    await getKlantById(_id);
    const { modifiedCount } = await getKlantCollection().updateOne(
      { _id },
      { $addToSet: { inschrijvingen: inschrijving._id } }
    );
    if (modifiedCount !== 1) throw new InternalServerError();
  },
  delete: async (klant) => {
    const { deletedCount } = await getKlantCollection().deleteOne(klant);
    if (deletedCount !== 1) throw new InternalServerError();
    const inschrijvingen = await Promise.all(
      klant.inschrijvingen.map(
        async (_id) => await getInschrijvingById(_id, false)
      )
    );
    await deleteInschrijvingen(inschrijvingen, CASCADETRAINING);
  },
  setVerified: async (klant) => {
    const verified = true;
    const verified_at = moment().local().toDate();

    const { modifiedCount } = await getKlantCollection().updateOne(
      { _id: klant._id },
      { $set: { verified, verified_at } }
    );
    if (modifiedCount !== 1) throw new InternalServerError();

    return { ...klant, verified, verified_at };
  },

  removeInschrijving: async (_id, inschrijving_id, session) => {
    const klant = await getKlantById(_id);
    if (!klant) throw new KlantNotFoundError();

    const inschrijving = await getInschrijvingById(inschrijving_id);
    if (!inschrijving) throw new InschrijvingNotFoundError();

    const { modifiedCount } = await getKlantCollection().updateOne(
      { _id },
      { $pull: { inschrijvingen: inschrijving_id } },
      { session }
    );
    if (modifiedCount !== 1) throw new InternalServerError();
  },
  deleteAll: async () => {
    const ids = (await getKlantCollection().find().toArray()).map(
      (item) => item._id
    );
    await getKlantCollection().deleteMany({ _id: { $in: [...ids] } });
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
