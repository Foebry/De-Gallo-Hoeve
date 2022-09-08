import moment from "moment";
import { Collection, ObjectId } from "mongodb";
import client from "../middleware/MongoDb";

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

export const getRasCollection = (): Collection => {
  return client.db("degallohoeve").collection("ras");
};

export const CreateRas = async (data: NewRas): Promise<RasCollection> => {
  const collection = getRasCollection();
  const rasData = { ...data, created_at: moment().local().toString() };
  const { insertedId } = await collection.insertOne(rasData);

  return await getRasById(insertedId);
};

export const getAllRassen = async (): Promise<RasCollection[]> => {
  const collection = getRasCollection();

  return (await collection.find().toArray()) as RasCollection[];
};

export const getRasById = async (_id: ObjectId): Promise<RasCollection> => {
  const collection = getRasCollection();

  return (await collection.findOne({ _id })) as RasCollection;
};

export const updateRas = async (
  _id: string,
  updateData: UpdateRas
): Promise<RasCollection> => {
  const collection = getRasCollection();
  const { upsertedId } = await collection.updateOne({ _id }, updateData);

  return await getRasById(upsertedId);
};

export const deleteRas = async (_id: ObjectId): Promise<void> => {
  const collection = getRasCollection();

  await collection.deleteOne({ _id });
};
