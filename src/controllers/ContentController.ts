import { Collection, ObjectId } from "mongodb";
import client from "../utils/MongoDb";
import {
  ContentNotFoundError,
  InternalServerError,
} from "../shared/RequestError";
import {
  ContentCollection,
  EditContent,
} from "../types/EntityTpes/ContentTypes";

export interface IsContentController {
  getContentCollection: () => Collection;
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
  getContentCollection: () => {
    const database = process.env.MONGODB_DATABASE;
    return client.db(database).collection("content");
  },
  findAllContent: async () => {
    const collections = await getContentCollection().find().toArray();
    return collections ? (collections as ContentCollection[]) : null;
  },
  getContentById: async (_id) => {
    const content = await getContentCollection().findOne({ _id });
    if (!content) throw new ContentNotFoundError();
    return content as ContentCollection;
  },
  editContent: async (_id, editData) => {
    const content = await getContentById(_id);

    const updatedContent = { ...content, ...editData };
    const { upsertedCount } = await getContentCollection().updateOne(
      { _id },
      updatedContent
    );
    if (upsertedCount !== 1) throw new InternalServerError();

    return updatedContent;
  },
  deleteContent: async (_id) => {
    await getContentById(_id);
    const { deletedCount } = await getContentCollection().deleteOne({ _id });
    if (deletedCount !== 1) throw new InternalServerError();
  },
  deleteAll: async () => {
    const ids = (await getContentCollection().find().toArray()).map(
      (item) => item._id
    );
    await getContentCollection().deleteMany({ _id: { $in: [...ids] } });
  },
};

export default ContentController;
export const { getContentCollection, getContentById } = ContentController;
export const CONTENT = "ContentController";
