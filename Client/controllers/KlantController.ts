import moment from "moment";
import { ClientSession, Collection, ObjectId } from "mongodb";
import { HondCollection } from "./HondController";
import {
  deleteInschrijvingen,
  getInschrijvingById,
  InschrijvingCollection,
} from "./InschrijvingController";
import client from "../middleware/MongoDb";
import {
  InternalServerError,
  KlantNotFoundError,
} from "../middleware/RequestError";
import { CASCADETRAINING } from "../middleware/Factory";

export interface KlantCollection extends NewKlant {
  _id: ObjectId;
  roles: string;
  verified: boolean;
  inschrijvingen: ObjectId[];
  reservaties: ObjectId[];
  created_at: string;
  verified_at?: string;
}

export interface NewKlant {
  email: string;
  password: string;
  vnaam: string;
  lnaam: string;
  gsm: string;
  straat: string;
  nr: number;
  bus?: string;
  gemeente: string;
  postcode: number;
  honden: HondCollection[];
}

export interface UpdateKlant {
  roles?: string;
  email?: string;
  password?: string;
  vnaam?: string;
  lnaam?: string;
  gsm?: string;
  straat?: string;
  nr?: number;
  gemeente?: string;
  postcode?: number;
  verified?: boolean;
  honden?: HondCollection[];
  inschrijvingen?: ObjectId[];
  reservaties?: ObjectId[];
  verified_at?: string;
}

export interface IsKlantController {
  getKlantCollection: () => Collection;
  getAllKlanten: () => Promise<KlantCollection[]>;
  getKlantById: (_id: ObjectId) => Promise<KlantCollection>;
  getKlantByEmail: (email: string) => Promise<KlantCollection | null>;
  save: (klant: KlantCollection) => Promise<KlantCollection>;
  update: (_id: ObjectId, klant: KlantCollection) => Promise<KlantCollection>;
  addKlantInschrijving: (
    _id: ObjectId,
    inschrijving: InschrijvingCollection,
    session: ClientSession
  ) => Promise<void>;
  delete: (klant: KlantCollection) => Promise<void>;
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
    return (await getKlantCollection().find().toArray()) as KlantCollection[];
  },
  getKlantById: async (_id) => {
    const klant = await getKlantCollection().findOne({ _id });
    if (!klant) throw new KlantNotFoundError();
    return klant as KlantCollection;
  },
  getKlantByEmail: async (email) => {
    return (await getKlantCollection().findOne({ email })) as KlantCollection;
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

// export const createKlant = async (data: NewKlant): Promise<KlantCollection> => {
//   const collection = getKlantCollection();
//   const klantData = {
//     ...data,
//     password: await brcypt.hash(data.password, 10),
//     honden: data.honden.map((hond) => ({
//       ...hond,
//       _id: new ObjectId(),
//       naam:
//         hond.naam.substring(0, 1).toUpperCase() +
//         hond.naam.substring(1).toLocaleLowerCase(),
//     })),
//     roles: "[]",
//     verified: false,
//     email: data.email.toLowerCase(),
//     inschrijvingen: [],
//     reservaties: [],
//     created_at: moment().local().toString(),
//     vnaam:
//       data.vnaam.substring(0, 1).toUpperCase() +
//       data.vnaam.substring(1).toLocaleLowerCase(),
//     lnaam:
//       data.lnaam.substring(0, 1).toUpperCase() +
//       data.lnaam.substring(1).toLocaleLowerCase(),
//     gemeente:
//       data.gemeente.substring(0, 1).toUpperCase() +
//       data.gemeente.substring(1).toLocaleLowerCase(),
//     straat:
//       data.straat.substring(0, 1).toUpperCase() +
//       data.straat.substring(1).toLocaleLowerCase(),
//   };

//   const { insertedId: klantId } = await collection.insertOne(klantData);

//   return await getKlantById(klantId);
// };

export const setVerified = async (_id: ObjectId) => {
  const collection = getKlantCollection();
  await collection.updateOne({ _id }, { $set: { verified: true } });
};
