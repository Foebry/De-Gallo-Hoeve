import { Collection, MongoClient, ObjectId } from "mongodb";

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

export const getContentCollection = (client: MongoClient): Collection => {
  return client.db("degallohoeve").collection("content");
};

export const findAllContent = async (
  client: MongoClient
): Promise<ContentCollection[]> => {
  const collection = getContentCollection(client);

  return (await collection.find().toArray()) as ContentCollection[];
};

export const getContentById = async (
  client: MongoClient,
  _id: ObjectId
): Promise<ContentCollection> => {
  const collection = getContentCollection(client);

  return (await collection.findOne({ _id })) as ContentCollection;
};

export const updateContentById = async (
  client: MongoClient,
  _id: ObjectId,
  data: UpdateContent
): Promise<ContentCollection> => {
  const collection = getContentCollection(client);
  const content = await getContentById(client, _id);
  const updatedContent = { ...content, ...data };
  const { upsertedId } = await collection.updateOne({ _id }, updatedContent);

  return await getContentById(client, upsertedId);
};

export const deleteContentById = async (
  client: MongoClient,
  _id: ObjectId
): Promise<void> => {
  const collection = getContentCollection(client);

  await collection.deleteOne({ _id });
};
