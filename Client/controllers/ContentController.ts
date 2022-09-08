import { Collection, ObjectId } from "mongodb";
import client from "../middleware/MongoDb";

export interface ContentCollection {
  _id: ObjectId;
  subtitle: string;
  content: string;
  default_content: string;
  image: string;
  created_at: Date;
  updated_at: Date;
  updated_by: string;
}

interface UpdateContent {
  subtitle?: string;
  content?: string;
  image?: string;
  default_content?: string;
}

export const getContentCollection = (): Collection => {
  return client.db("degallohoeve").collection("content");
};

export const findAllContent = async (): Promise<ContentCollection[]> => {
  const collection = getContentCollection();

  return (await collection.find().toArray()) as ContentCollection[];
};

export const getContentById = async (
  _id: ObjectId
): Promise<ContentCollection> => {
  const collection = getContentCollection();

  return (await collection.findOne({ _id })) as ContentCollection;
};

export const updateContentById = async (
  _id: ObjectId,
  data: UpdateContent
): Promise<ContentCollection> => {
  const collection = getContentCollection();
  const content = await getContentById(_id);
  const updatedContent = { ...content, ...data };
  const { upsertedId } = await collection.updateOne({ _id }, updatedContent);

  return await getContentById(upsertedId);
};

export const deleteContentById = async (_id: ObjectId): Promise<void> => {
  const collection = getContentCollection();

  await collection.deleteOne({ _id });
};
