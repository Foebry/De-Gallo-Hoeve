import { Collection, ObjectId } from "mongodb";
import client from "../middleware/MongoDb";
import {
  ConfirmNotFoundError,
  InternalServerError,
  KlantNotFoundError,
} from "../middleware/RequestError";
import { getKlantCollection } from "./KlantController";

export interface ConfirmCollection {
  _id: ObjectId;
  code: string;
  klant_id: ObjectId;
  created_at: string;
}

export interface NewConfirm {
  klant_id: ObjectId;
  created_at: string;
}

interface updateConfirm {
  code: string;
}

export const CONFIRM = "ConfirmController";

export interface IsConfirmController {
  getConfirmCollection: () => Collection;
  saveConfirm: (confirm: ConfirmCollection) => Promise<ConfirmCollection>;
  getAllConfirm: () => Promise<ConfirmCollection[]>;
  getConfirmById: (_id: ObjectId) => Promise<ConfirmCollection | string>;
  getConfirmByKlantId: (
    klant_id: ObjectId
  ) => Promise<ConfirmCollection | null>;
  editConfirm: (
    klant_id: ObjectId,
    editData: updateConfirm
  ) => Promise<ConfirmCollection>;
  deleteConfirmByKlantId: (_id: ObjectId) => Promise<void>;
}

const ConfirmController: IsConfirmController = {
  getConfirmCollection: () => {
    return client.db("degallohoeve").collection("confirm");
  },
  saveConfirm: async (confirm) => {
    const { acknowledged } = await getConfirmCollection().insertOne(confirm);
    if (!acknowledged) throw new InternalServerError();
    return confirm;
  },
  getAllConfirm: async () => {
    const allConfirms = await getConfirmCollection().find().toArray();
    return allConfirms as ConfirmCollection[];
  },
  getConfirmById: async (_id) => {
    const confirm = await getConfirmCollection().findOne({ _id });
    if (!confirm) throw new ConfirmNotFoundError();
    return confirm as ConfirmCollection;
  },
  getConfirmByKlantId: async (klant_id) => {
    const klant = await getKlantCollection().findOne({ _id: klant_id });
    if (!klant) throw new KlantNotFoundError();

    const confirm = await getConfirmCollection().findOne({ klant_id });
    if (!confirm) throw new ConfirmNotFoundError();

    return confirm as ConfirmCollection;
  },
  editConfirm: async (klant_id, editData) => {
    const klant = await getKlantCollection().findOne({ _id: klant_id });
    if (!klant) throw new KlantNotFoundError();

    const confirm = await getConfirmByKlantId(klant_id);
    if (!confirm) throw new ConfirmNotFoundError();

    const updatedConfirm = { ...confirm, ...editData };
    const { modifiedCount } = await getConfirmCollection().updateOne(
      { _id: confirm._id },
      updatedConfirm
    );
    if (modifiedCount !== 1) throw new InternalServerError();

    return updatedConfirm;
  },
  deleteConfirmByKlantId: async (klant_id) => {
    const klant = await getKlantCollection().findOne({ _id: klant_id });
    if (!klant) throw new KlantNotFoundError();

    const confirm = await getConfirmByKlantId(klant_id);
    if (!confirm) throw new ConfirmNotFoundError();

    const { deletedCount } = await getConfirmCollection().deleteOne({
      _id: confirm._id,
    });
    if (deletedCount !== 1) throw new InternalServerError();
  },
};

export default ConfirmController;
export const { getConfirmCollection, getConfirmById, getConfirmByKlantId } =
  ConfirmController;
