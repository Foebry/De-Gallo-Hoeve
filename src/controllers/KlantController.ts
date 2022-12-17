import moment from "moment";
import { ClientSession, Collection, ObjectId } from "mongodb";
import {
  deleteInschrijvingen,
  getInschrijvingById,
} from "./InschrijvingController";
import {
  InschrijvingNotFoundError,
  InternalServerError,
  KlantNotFoundError,
} from "@/shared/RequestError";
import { CASCADETRAINING } from "@/services/Factory";
import { IsKlantCollection } from "@/types/EntityTpes/KlantTypes";
import { InschrijvingCollection } from "@/types/EntityTpes/InschrijvingTypes";
import { HondCollection } from "@/types/EntityTpes/HondTypes";
import { getConnection } from "@/utils/MongoDb";

export interface IsKlantController {
  getKlantCollection: () => Promise<Collection>;
  getAllKlanten: () => Promise<IsKlantCollection[]>;
  getKlantById: (_id: ObjectId) => Promise<IsKlantCollection | null>;
  getKlantByEmail: (
    email: string,
    db?: any
  ) => Promise<IsKlantCollection | null>;
  getEigenaarVanHond: (
    hond: HondCollection
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
  getKlantCollection: async () => {
    const database = process.env.MONGODB_DATABASE;
    const client = await getConnection();
    return client.db(database).collection("klant");
  },
  getAllKlanten: async () => {
    const collection = await getKlantCollection();
    return (await collection.find().toArray()) as IsKlantCollection[];
  },
  getKlantById: async (_id) => {
    const collection = await getKlantCollection();
    const klant = await collection.findOne({ _id });
    return klant as IsKlantCollection;
  },
  getKlantByEmail: async (email) => {
    const collection = await getKlantCollection();
    return (await collection.findOne({ email })) as IsKlantCollection;
  },
  getEigenaarVanHond: async (hond) => {
    const collection = await getKlantCollection();
    return collection.findOne({
      honden: { $elemMatch: { _id: hond._id } },
    }) as Promise<IsKlantCollection>;
  },
  save: async (klant) => {
    const collection = await getKlantCollection();
    const { insertedId } = await collection.insertOne(klant);
    if (!insertedId) throw new InternalServerError();
    return { ...klant, _id: insertedId };
  },
  update: async (_id, updateKlant) => {
    const collection = await getKlantCollection();
    const { upsertedCount } = await collection.updateOne({ _id }, updateKlant);
    if (upsertedCount !== 1) throw new InternalServerError();
    return updateKlant;
  },
  addKlantInschrijving: async (_id, inschrijving, session) => {
    const collection = await getKlantCollection();
    await getKlantById(_id);
    const { modifiedCount } = await collection.updateOne(
      { _id },
      { $addToSet: { inschrijvingen: inschrijving._id } }
    );
    if (modifiedCount !== 1) throw new InternalServerError();
  },
  delete: async (klant) => {
    const collection = await getKlantCollection();
    const { deletedCount } = await collection.deleteOne(klant);
    if (deletedCount !== 1) throw new InternalServerError();
    const inschrijvingen = await Promise.all(
      klant.inschrijvingen.map(
        async (_id) => await getInschrijvingById(_id, false)
      )
    );
    await deleteInschrijvingen(inschrijvingen, CASCADETRAINING);
  },
  setVerified: async (klant) => {
    const collection = await getKlantCollection();
    const verified = true;
    const verified_at = moment().local().toDate();

    const { modifiedCount } = await collection.updateOne(
      { _id: klant._id },
      { $set: { verified, verified_at } }
    );
    if (modifiedCount !== 1) throw new InternalServerError();

    return { ...klant, verified, verified_at };
  },

  removeInschrijving: async (_id, inschrijving_id, session) => {
    const collection = await getKlantCollection();
    const klant = await getKlantById(_id);
    if (!klant) throw new KlantNotFoundError();

    const inschrijving = await getInschrijvingById(inschrijving_id);
    if (!inschrijving) throw new InschrijvingNotFoundError();

    const { modifiedCount } = await collection.updateOne(
      { _id },
      { $pull: { inschrijvingen: inschrijving_id } },
      { session }
    );
    if (modifiedCount !== 1) throw new InternalServerError();
  },
  deleteAll: async () => {
    const collection = await getKlantCollection();
    const ids = (await collection.find().toArray()).map((item) => item._id);
    await collection.deleteMany({ _id: { $in: [...ids] } });
  },
};

export default KlantController;
export const KLANT = "KlantController";
export const {
  getKlantCollection,
  getKlantById,
  getKlantByEmail,
  getAllKlanten,
  getEigenaarVanHond,
  update: updateKlant,
  addKlantInschrijving,
  removeInschrijving: removeKlantInschrijving,
} = KlantController;
