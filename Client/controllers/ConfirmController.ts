import moment from "moment";
import { Collection, ObjectId } from "mongodb";
import Factory from "../middlewares/Factory";
import client from "../middlewares/MongoDb";
import {
  ConfirmNotFoundError,
  InternalServerError,
  KlantNotFoundError,
} from "../middlewares/RequestError";
import { ConfirmCollection } from "../types/EntityTpes/ConfirmTypes";
import { getKlantCollection } from "./KlantController";

export interface IsConfirmController {
  getConfirmCollection: () => Collection;
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
  getConfirmCollection: () => {
    const database = process.env.MONGODB_DATABASE;
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
  getConfirmByCode: async (code) => {
    const confirm = await getConfirmCollection().findOne({ code });
    return confirm as ConfirmCollection;
  },
  reset: async (confirm) => {
    await getConfirmCollection().deleteOne(confirm);

    const newConfirm = Factory.createConfirm({
      klant_id: confirm.klant_id,
      created_at: moment().local().toDate(),
    });
    const { insertedId: _id } = await getConfirmCollection().insertOne(
      newConfirm
    );

    return getConfirmById(_id);
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
  deleteAll: async () => {
    const ids = (await getConfirmCollection().find().toArray()).map(
      (item) => item._id
    );
    await getConfirmCollection().deleteMany({ _id: { $in: [...ids] } });
  },
};

export default ConfirmController;
export const {
  getConfirmCollection,
  getConfirmById,
  getConfirmByKlantId,
  getConfirmByCode,
} = ConfirmController;
