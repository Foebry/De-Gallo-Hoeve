import moment from "moment";
import { Collection, ObjectId } from "mongodb";
import Factory from "../services/Factory";
import {
  ConfirmNotFoundError,
  InternalServerError,
  KlantNotFoundError,
} from "../shared/RequestError";
import { ConfirmCollection } from "../types/EntityTpes/ConfirmTypes";
import { getKlantCollection } from "./KlantController";
import { getConnection } from "src/utils/MongoDb";

export interface IsConfirmController {
  getConfirmCollection: () => Promise<Collection>;
  saveConfirm: (confirm: ConfirmCollection) => Promise<ConfirmCollection>;
  getAllConfirm: () => Promise<ConfirmCollection[]>;
  getConfirmById: (_id: ObjectId) => Promise<ConfirmCollection>;
  getConfirmByKlantId: (
    klant_id: ObjectId
  ) => Promise<ConfirmCollection | null>;
  getConfirmByCode: (code: string) => Promise<null | ConfirmCollection>;
  reset: (confirm: ConfirmCollection) => Promise<ConfirmCollection>;
  deleteConfirmByKlantId: (_id: ObjectId) => Promise<void>;
  deleteAll: () => Promise<void>;
}

const ConfirmController: IsConfirmController = {
  getConfirmCollection: async () => {
    const database = process.env.MONGODB_DATABASE;
    const client = await getConnection();
    return client.db(database).collection("confirm");
  },
  saveConfirm: async (confirm) => {
    const { acknowledged } = await (
      await getConfirmCollection()
    ).insertOne(confirm);
    if (!acknowledged) throw new InternalServerError();
    return confirm;
  },
  getAllConfirm: async () => {
    const collection = await getConfirmCollection();
    const allConfirms = await collection.find().toArray();
    return allConfirms as ConfirmCollection[];
  },
  getConfirmById: async (_id) => {
    const collection = await getConfirmCollection();
    const confirm = await collection.findOne({ _id });
    if (!confirm) throw new ConfirmNotFoundError();
    return confirm as ConfirmCollection;
  },
  getConfirmByKlantId: async (klant_id) => {
    const collection = await getConfirmCollection();
    const klantCollection = await getKlantCollection();
    const klant = await klantCollection.findOne({ _id: klant_id });
    if (!klant) throw new KlantNotFoundError();

    const confirm = await collection.findOne({ klant_id });
    if (!confirm) throw new ConfirmNotFoundError();

    return confirm as ConfirmCollection;
  },
  getConfirmByCode: async (code) => {
    const collection = await getConfirmCollection();
    const confirm = await collection.findOne({ code });
    return confirm as ConfirmCollection;
  },
  reset: async (confirm) => {
    const collection = await getConfirmCollection();
    await collection.deleteOne(confirm);

    const newConfirm = Factory.createConfirm({
      klant_id: confirm.klant_id,
      created_at: moment().local().toDate(),
    });
    const { insertedId: _id } = await collection.insertOne(newConfirm);

    return getConfirmById(_id);
  },
  deleteConfirmByKlantId: async (klant_id) => {
    const collection = await getConfirmCollection();
    const klantCollection = await getKlantCollection();
    const klant = await klantCollection.findOne({ _id: klant_id });
    if (!klant) throw new KlantNotFoundError();

    const confirm = await getConfirmByKlantId(klant_id);
    if (!confirm) throw new ConfirmNotFoundError();

    const { deletedCount } = await collection.deleteOne({
      _id: confirm._id,
    });
    if (deletedCount !== 1) throw new InternalServerError();
  },
  deleteAll: async () => {
    const collection = await getConfirmCollection();
    const ids = (await collection.find().toArray()).map((item) => item._id);
    await collection.deleteMany({ _id: { $in: [...ids] } });
  },
};

export default ConfirmController;
export const {
  getConfirmCollection,
  getConfirmById,
  getConfirmByKlantId,
  getConfirmByCode,
} = ConfirmController;
