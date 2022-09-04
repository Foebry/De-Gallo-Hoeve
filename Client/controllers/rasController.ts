import moment from "moment";
import { Collection, MongoClient, ObjectId } from "mongodb";

interface NewRas {
  naam: string;
  soort: string;
  avatar: string;
}

export interface RasCollection extends NewRas {
  _id: ObjectId;
  created_at: Date;
}

interface UpdateRas {
  naam?: string;
  soort: string;
  avatar: string;
}

export const getRasCollection = (client: MongoClient): Collection => {
  return client.db("degallohoeve").collection("ras");
};

export const CreateRas = async (
  client: MongoClient,
  data: NewRas
): Promise<RasCollection> => {
  const collection = getRasCollection(client);
  const rasData = { ...data, created_at: moment().local().toString() };
  const { insertedId } = await collection.insertOne(rasData);

  return await getRasById(client, insertedId);
};

export const getAllRassen = async (
  client: MongoClient
): Promise<RasCollection[]> => {
  const collection = getRasCollection(client);

  return (await collection.find().toArray()) as RasCollection[];
};

export const getRasById = async (
  client: MongoClient,
  _id: ObjectId
): Promise<RasCollection> => {
  const collection = getRasCollection(client);

  return (await collection.findOne({ _id })) as RasCollection;
};

export const updateRas = async (
  client: MongoClient,
  _id: string,
  updateData: UpdateRas
): Promise<RasCollection> => {
  const collection = getRasCollection(client);
  const { upsertedId } = await collection.updateOne({ _id }, updateData);

  return await getRasById(client, upsertedId);
};

export const deleteRas = async (
  client: MongoClient,
  _id: ObjectId
): Promise<void> => {
  const collection = getRasCollection(client);

  await collection.deleteOne({ _id });
};
