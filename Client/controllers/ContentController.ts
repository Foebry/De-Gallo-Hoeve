import { Collection, ObjectId } from "mongodb";
import client from "../middleware/MongoDb";
import {
  ContentNotFoundError,
  InternalServerError,
} from "../middleware/RequestError";

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

interface EditContent {
  subtitle?: string;
  content?: string;
  image?: string;
  default_content?: string;
}

export interface IsContentController {
  getContentCollection: () => Collection;
  findAllContent: () => Promise<ContentCollection[] | null>;
  getContentById: (_id: ObjectId) => Promise<ContentCollection>;
  editContent: (
    _id: ObjectId,
    editData: EditContent
  ) => Promise<ContentCollection>;
  deleteContent: (_id: ObjectId) => Promise<void>;
}

const ContentController: IsContentController = {
  getContentCollection: () => {
    return client.db("degallohoeve").collection("content");
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
};

export default ContentController;
export const { getContentCollection, getContentById } = ContentController;
export const CONTENT = "ContentController";
