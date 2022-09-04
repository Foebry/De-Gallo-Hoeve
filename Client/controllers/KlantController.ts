import moment from "moment";
import { Collection, MongoClient, ObjectId } from "mongodb";
import { HondCollection } from "./HondController";
import { deleteInschrijvingen } from "./InschrijvingController";
import brcypt from "bcrypt";

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
export const getKlantCollection = (client: MongoClient): Collection => {
  return client.db("degallohoeve").collection("klant");
};

export const getAllKlanten = async (
  client: MongoClient
): Promise<KlantCollection[]> => {
  const collection = getKlantCollection(client);

  return (await collection.find().toArray()) as KlantCollection[];
};

export const getKlantById = async (
  client: MongoClient,
  _id: ObjectId
): Promise<KlantCollection> => {
  const collection = getKlantCollection(client);

  return (await collection.findOne({ _id })) as KlantCollection;
};

export const getKlantByEmail = async (
  client: MongoClient,
  email: string
): Promise<KlantCollection> => {
  const collection = getKlantCollection(client);

  return (await collection.findOne({ email })) as KlantCollection;
};

export const createKlant = async (
  client: MongoClient,
  data: NewKlant
): Promise<KlantCollection> => {
  const collection = getKlantCollection(client);
  const klantData = {
    ...data,
    password: await brcypt.hash(data.password, 10),
    honden: data.honden.map((hond) => ({
      ...hond,
      _id: new ObjectId(),
      naam:
        hond.naam.substring(0, 1).toUpperCase() +
        hond.naam.substring(1).toLocaleLowerCase(),
    })),
    roles: "[]",
    verified: false,
    email: data.email.toLowerCase(),
    inschrijvingen: [],
    reservaties: [],
    created_at: moment().local().toString(),
    vnaam:
      data.vnaam.substring(0, 1).toUpperCase() +
      data.vnaam.substring(1).toLocaleLowerCase(),
    lnaam:
      data.lnaam.substring(0, 1).toUpperCase() +
      data.lnaam.substring(1).toLocaleLowerCase(),
    gemeente:
      data.gemeente.substring(0, 1).toUpperCase() +
      data.gemeente.substring(1).toLocaleLowerCase(),
    straat:
      data.straat.substring(0, 1).toUpperCase() +
      data.straat.substring(1).toLocaleLowerCase(),
  };

  const { insertedId: klantId } = await collection.insertOne(klantData);

  return await getKlantById(client, klantId);
};

export const updateKlant = async (
  client: MongoClient,
  klant_id: ObjectId,
  data: UpdateKlant
): Promise<KlantCollection> => {
  const collection = getKlantCollection(client);
  const { upsertedId } = await collection.updateOne({ _id: klant_id }, data);

  return await getKlantById(client, upsertedId);
};

export const deleteKlant = async (
  client: MongoClient,
  _id: ObjectId
): Promise<void> => {
  const { inschrijvingen } = await getKlantById(client, _id);
  const collection = getKlantCollection(client);
  await collection.deleteOne({ _id });

  await deleteInschrijvingen(client, inschrijvingen);
};
