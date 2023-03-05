import moment from 'moment';
import { ObjectId } from 'mongodb';
import { InternalServerError } from '../shared/RequestError';
import { ConfirmCollection } from '../types/EntityTpes/ConfirmTypes';
import { getConfirmCollection } from 'src/utils/db';
import { getCurrentTime, toLocalTime } from 'src/shared/functions';
import {
  createRandomConfirmCode,
  getKlantIdFromConfirmCode,
} from 'src/pages/api/confirm/[code]/repo';

export const save = async (confirm: ConfirmCollection): Promise<ConfirmCollection> => {
  const controller = await getConfirmCollection();
  const { acknowledged } = await controller.insertOne(confirm);
  if (!acknowledged) throw new InternalServerError();

  return confirm;
};

export const getAllConfirm = async (): Promise<ConfirmCollection[]> => {
  const collection = await getConfirmCollection();
  return collection.find().toArray();
};

export const getConfirmById = async (
  _id: ObjectId
): Promise<ConfirmCollection | null> => {
  const collection = await getConfirmCollection();
  return collection.findOne({ _id });
};

export const getConfirmByKlantId = async (
  klant_id: ObjectId
): Promise<ConfirmCollection | null> => {
  const collection = await getConfirmCollection();
  return collection.findOne({ klant_id });
};

export const updateConfirm = async (
  _id: ObjectId,
  data: ConfirmCollection
): Promise<void> => {
  const collection = await getConfirmCollection();
  const { modifiedCount } = await collection.updateOne({ _id }, { $set: data });
  if (modifiedCount !== 1) throw new InternalServerError();
};

export const reset = async (confirm: ConfirmCollection): Promise<ConfirmCollection> => {
  const collection = await getConfirmCollection();
  const [klant_id, valid_to] = getKlantIdFromConfirmCode(confirm.code);
  const newCode = createRandomConfirmCode(klant_id);
  await collection.updateOne(
    { _id: confirm._id },
    {
      $set: {
        valid_to: new Date(valid_to),
        code: newCode,
      },
    }
  );
  return { ...confirm, valid_to: new Date(valid_to), code: newCode };
};

export const deleteAll = async (): Promise<void> => {
  const collection = await getConfirmCollection();

  if (process.env.NODE_ENV === 'test') {
    collection.deleteMany({});
  }
};

const confirmController: IsConfirmController = {
  deleteAll,
  reset,
  updateConfirm,
  getConfirmByKlantId,
  getConfirmById,
  getAllConfirm,
  save,
};

export type IsConfirmController = {
  deleteAll: () => Promise<void>;
  reset: (confirm: ConfirmCollection) => Promise<ConfirmCollection>;
  updateConfirm: (_id: ObjectId, data: ConfirmCollection) => Promise<void>;
  getConfirmByKlantId: (klant_id: ObjectId) => Promise<ConfirmCollection | null>;
  getConfirmById: (_id: ObjectId) => Promise<ConfirmCollection | null>;
  getAllConfirm: () => Promise<ConfirmCollection[]>;
  save: (confirm: ConfirmCollection) => Promise<ConfirmCollection>;
};

export default confirmController;
