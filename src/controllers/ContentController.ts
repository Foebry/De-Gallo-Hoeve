import { ObjectId } from 'mongodb';
import { InternalServerError } from '../shared/RequestError';
import { ContentCollection } from '../types/EntityTpes/ContentTypes';
import { getContentCollection } from 'src/utils/db';
import { getCurrentTime } from 'src/shared/functions';

export const findAllContent = async (): Promise<ContentCollection[]> => {
  const collection = await getContentCollection();
  return collection.find().toArray() as Promise<ContentCollection[]>;
};

export const getContentById = async (
  _id: ObjectId
): Promise<ContentCollection | null> => {
  const collection = await getContentCollection();
  return collection.findOne({ _id });
};

export const editContent = async (
  data: ContentCollection
): Promise<ContentCollection> => {
  const collection = await getContentCollection();
  const updatedContent = { ...data, updated_at: getCurrentTime() };
  const { modifiedCount } = await collection.updateOne(
    { _id: data._id },
    { $set: updatedContent }
  );
  if (modifiedCount !== 1) throw new InternalServerError();

  return data;
};

export const hardDelete = async (content: ContentCollection): Promise<void> => {
  const collection = await getContentCollection();

  const { deletedCount } = await collection.deleteOne(content);
  if (deletedCount !== 1) throw new InternalServerError();
};

export const softDelete = async (content: ContentCollection): Promise<void> => {
  const collection = await getContentCollection();

  const deletedContent = { ...content, deleted_at: getCurrentTime() };
  const { upsertedCount } = await collection.updateOne(
    { _id: content._id },
    deletedContent
  );
  if (upsertedCount !== 1) throw new InternalServerError();
};

export const deleteAll = async (): Promise<void> => {
  const collection = await getContentCollection();

  if (process.env.NODE_ENV === 'test') {
    collection.deleteMany({});
  }
};

const contentController: IsContentController = {
  deleteAll,
  softDelete,
  hardDelete,
  editContent,
  getContentById,
  findAllContent,
};

export type IsContentController = {
  findAllContent: () => Promise<ContentCollection[]>;
  getContentById: (_id: ObjectId) => Promise<ContentCollection | null>;
  editContent: (content: ContentCollection) => Promise<ContentCollection>;
  hardDelete: (content: ContentCollection) => Promise<void>;
  softDelete: (content: ContentCollection) => Promise<void>;
  deleteAll: () => Promise<void>;
};

export default contentController;
export const CONTENT = 'ContentController';
