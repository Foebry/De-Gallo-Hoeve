import moment from "moment";
import { Code, ObjectId } from "mongodb";
import { InternalServerError } from "../shared/RequestError";
import { ConfirmCollection } from "../types/EntityTpes/ConfirmTypes";
import { getConfirmCollection } from "src/utils/db";
import {
  createRandomConfirmCode,
  getCurrentTime,
  toLocalTime,
} from "src/shared/functions";

export const save = async (
  confirm: ConfirmCollection
): Promise<ConfirmCollection> => {
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

export const getConfirmByCode = async (
  code: string
): Promise<ConfirmCollection | null> => {
  const collection = await getConfirmCollection();
  return collection.findOne({ code });
};

export const updateConfirm = async (
  _id: ObjectId,
  data: ConfirmCollection
): Promise<void> => {
  const collection = await getConfirmCollection();
  const { upsertedCount } = await collection.updateOne({ _id }, data);
  if (upsertedCount !== 1) throw new InternalServerError();
};

export const reset = async (
  confirm: ConfirmCollection
): Promise<ConfirmCollection> => {
  const collection = await getConfirmCollection();
  const newCode = createRandomConfirmCode();
  const valid_to = toLocalTime(moment(getCurrentTime()).add(1, "day").format());
  await collection.updateOne(
    { _id: confirm._id },
    {
      $set: {
        valid_to,
        code: newCode,
      },
    }
  );
  return { ...confirm, valid_to, code: newCode };
};

export const deleteByKlantId = async (klant_id: ObjectId): Promise<void> => {
  const collection = await getConfirmCollection();
  const { deletedCount } = await collection.deleteOne({ klant_id });
  if (deletedCount !== 1) throw new InternalServerError();
};

export const deleteAll = async (): Promise<void> => {
  const collection = await getConfirmCollection();

  if (process.env.NODE_ENV === "test") {
    collection.deleteMany({});
  }
};

const confirmController: IsConfirmController = {
  deleteAll,
  deleteByKlantId,
  reset,
  updateConfirm,
  getConfirmByCode,
  getConfirmByKlantId,
  getConfirmById,
  getAllConfirm,
  save,
};

export type IsConfirmController = {
  deleteAll: () => Promise<void>;
  deleteByKlantId: (klant_id: ObjectId) => Promise<void>;
  reset: (confirm: ConfirmCollection) => Promise<ConfirmCollection>;
  updateConfirm: (_id: ObjectId, data: ConfirmCollection) => Promise<void>;
  getConfirmByCode: (code: string) => Promise<ConfirmCollection | null>;
  getConfirmByKlantId: (
    klant_id: ObjectId
  ) => Promise<ConfirmCollection | null>;
  getConfirmById: (_id: ObjectId) => Promise<ConfirmCollection | null>;
  getAllConfirm: () => Promise<ConfirmCollection[]>;
  save: (confirm: ConfirmCollection) => Promise<ConfirmCollection>;
};

export default confirmController;
