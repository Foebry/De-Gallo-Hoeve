import { Collection, ObjectId } from "mongodb";
import { nanoid } from "nanoid";
import client from "../middleware/MongoDb";

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

export const getConfirmCollection = (): Collection => {
  return client.db("degallohoeve").collection("confirm");
};

export const createConfirm = async (
  confirm: NewConfirm
): Promise<ConfirmCollection> => {
  const collection = getConfirmCollection();
  const { insertedId } = await collection.insertOne({
    ...confirm,
    code: nanoid(50),
  });

  return getConfirmById(insertedId);
};

export const getAllConfirm = async (): Promise<ConfirmCollection[]> => {
  const collection = getConfirmCollection();

  return (await collection.find().toArray()) as ConfirmCollection[];
};

export const getConfirmById = async (
  _id: ObjectId
): Promise<ConfirmCollection> => {
  const collection = getConfirmCollection();

  return (await collection.findOne({ _id })) as ConfirmCollection;
};

export const getConfirmByKlantId = async (
  klant_id: ObjectId
): Promise<ConfirmCollection> => {
  const collection = getConfirmCollection();

  return (await collection.findOne({ klant_id })) as ConfirmCollection;
};

export const updateConfirmForKlantId = async (
  klant_id: ObjectId,
  update: updateConfirm
): Promise<ConfirmCollection> => {
  const collection = getConfirmCollection();
  const confirm = await getConfirmByKlantId(klant_id);
  const updatedConfirm = { ...confirm, ...update };
  const { upsertedId } = await collection.updateOne(
    { _id: confirm._id },
    updatedConfirm
  );

  return await getConfirmById(upsertedId);
};

export const deleteConfirmByKlantId = async (
  klant_id: ObjectId
): Promise<void> => {
  const collection = getConfirmCollection();
  const { _id } = await getConfirmByKlantId(klant_id);

  await collection.deleteOne({ _id });
};
