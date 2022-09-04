import { Collection, MongoClient, ObjectId } from "mongodb";
import { nanoid } from "nanoid";

export interface ConfirmCollection {
  _id: ObjectId;
  code: string;
  klant_id: ObjectId;
  created_at: string;
}

interface NewConfirm {
  klant_id: ObjectId;
  created_at: string;
}

interface updateConfirm {
  code: string;
}

export const getConfirmCollection = (client: MongoClient): Collection => {
  return client.db("degallohoeve").collection("confirm");
};

export const createConfirm = async (
  client: MongoClient,
  confirm: NewConfirm
): Promise<ConfirmCollection> => {
  const collection = getConfirmCollection(client);
  const { insertedId } = await collection.insertOne({
    ...confirm,
    code: nanoid(50),
  });

  return getConfirmById(client, insertedId);
};

export const getAllConfirm = async (
  client: MongoClient
): Promise<ConfirmCollection[]> => {
  const collection = getConfirmCollection(client);

  return (await collection.find().toArray()) as ConfirmCollection[];
};

export const getConfirmById = async (
  client: MongoClient,
  _id: ObjectId
): Promise<ConfirmCollection> => {
  const collection = getConfirmCollection(client);

  return (await collection.findOne({ _id })) as ConfirmCollection;
};

export const getConfirmByKlantId = async (
  client: MongoClient,
  klant_id: ObjectId
): Promise<ConfirmCollection> => {
  const collection = getConfirmCollection(client);

  return (await collection.findOne({ klant_id })) as ConfirmCollection;
};

export const updateConfirmForKlantId = async (
  client: MongoClient,
  klant_id: ObjectId,
  update: updateConfirm
): Promise<ConfirmCollection> => {
  const collection = getConfirmCollection(client);
  const confirm = await getConfirmByKlantId(client, klant_id);
  const updatedConfirm = { ...confirm, ...update };
  const { upsertedId } = await collection.updateOne(
    { _id: confirm._id },
    updatedConfirm
  );

  return await getConfirmById(client, upsertedId);
};

export const deleteConfirmByKlantId = async (
  client: MongoClient,
  klant_id: ObjectId
): Promise<void> => {
  const collection = getConfirmCollection(client);
  const { _id } = await getConfirmByKlantId(client, klant_id);

  await collection.deleteOne({ _id });
};
