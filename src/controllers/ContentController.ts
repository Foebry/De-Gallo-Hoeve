import { Collection, ObjectId } from "mongodb";
import { getConnection } from "src/utils/MongoDb";
import {
  ContentNotFoundError,
  InternalServerError,
} from "../shared/RequestError";
import {
  ContentCollection,
  EditContent,
} from "../types/EntityTpes/ContentTypes";

export interface IsContentController {
  getContentCollection: () => Promise<Collection>;
  findAllContent: () => Promise<ContentCollection[] | null>;
  getContentById: (_id: ObjectId) => Promise<ContentCollection>;
  editContent: (
    _id: ObjectId,
    editData: EditContent
  ) => Promise<ContentCollection>;
  deleteContent: (_id: ObjectId) => Promise<void>;
  deleteAll: () => Promise<void>;
}

const ContentController: IsContentController = {
  getContentCollection: async () => {
    const database = process.env.MONGODB_DATABASE;
    const client = await getConnection();
    return client.db(database).collection("content");
  },
  findAllContent: async () => {
    const collection = await getContentCollection();
    const collections = await collection.find().toArray();
    return collections ? (collections as ContentCollection[]) : null;
  },
  getContentById: async (_id) => {
    const collection = await getContentCollection();
    const content = await collection.findOne({ _id });
    if (!content) throw new ContentNotFoundError();
    return content as ContentCollection;
  },
  editContent: async (_id, editData) => {
    const collection = await getContentCollection();
    const content = await getContentById(_id);

    const updatedContent = { ...content, ...editData };
    const { upsertedCount } = await collection.updateOne(
      { _id },
      updatedContent
    );
    if (upsertedCount !== 1) throw new InternalServerError();

    return updatedContent;
  },
  deleteContent: async (_id) => {
    const collection = await getContentCollection();
    await getContentById(_id);
    const { deletedCount } = await collection.deleteOne({ _id });
    if (deletedCount !== 1) throw new InternalServerError();
  },
  deleteAll: async () => {
    const collection = await getContentCollection();
    const ids = (await collection.find().toArray()).map((item) => item._id);
    await collection.deleteMany({ _id: { $in: [...ids] } });
  },
};

export default ContentController;
export const { getContentCollection, getContentById } = ContentController;
export const CONTENT = "ContentController";
