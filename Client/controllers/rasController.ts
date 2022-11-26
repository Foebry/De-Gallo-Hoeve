import { Collection, ObjectId } from "mongodb";
import client from "../middleware/MongoDb";
import {
  InternalServerError,
  RasNotFoundError,
} from "../middleware/RequestError";
import { RasCollection, UpdateRas } from "../types/EntityTpes/RasTypes";

export interface IsRasController {
  getRasCollection: () => Collection;
  save: (ras: RasCollection) => Promise<RasCollection>;
  getAllRassen: () => Promise<RasCollection[]>;
  getRasById: (_id: ObjectId, breakEarly?: boolean) => Promise<RasCollection>;
  getRasByName: (naam: string) => Promise<RasCollection | null>;
  update: (_id: ObjectId, updateRas: UpdateRas) => Promise<RasCollection>;
  delete: (ras: ObjectId) => Promise<void>;
  deleteAll: () => Promise<void>;
  getRandomRasNaam: () => Promise<string>;
}

const RasController: IsRasController = {
  getRasCollection: () => {
    const database = process.env.MONGODB_DATABASE;
    return client.db(database).collection("ras");
  },
  getRasByName: (naam) => {
    return getRasCollection().findOne({ naam }) as Promise<RasCollection>;
  },
  save: async (ras) => {
    const { insertedId } = await getRasCollection().insertOne(ras);
    if (!insertedId) throw new InternalServerError();

    return await getRasById(insertedId);
  },
  getRasById: async (_id, breakEarly = true) => {
    const ras = await getRasCollection().findOne({ _id });
    if (!ras && breakEarly) throw new RasNotFoundError();
    return ras as RasCollection;
  },
  getAllRassen: async () => {
    return (await getRasCollection().find().toArray()) as RasCollection[];
  },
  update: async (_id, updateRas) => {
    await getRasById(_id);
    const collection = getRasCollection();
    const { upsertedCount } = await collection.updateOne({ _id }, updateRas);
    if (upsertedCount !== 1) throw new InternalServerError();
    return await getRasById(_id);
  },
  delete: async (_id) => {
    const ras = await getRasById(_id);
    const { deletedCount } = await getRasCollection().deleteOne(ras);
    if (deletedCount !== 1) throw new InternalServerError();
  },
  deleteAll: async () => {
    const ids = (await getRasCollection().find().toArray()).map(
      (item) => item._id
    );
    await getRasCollection().deleteMany({ _id: { $in: [...ids] } });
  },
  getRandomRasNaam: async () => {
    const rassen = await getAllRassen();
    const random = Math.floor(Math.random() * rassen.length);
    return rassen[random].naam;
  },
};

export default RasController;
export const RAS = "RasController";
export const {
  getRasCollection,
  getRasById,
  getAllRassen,
  getRandomRasNaam,
  getRasByName,
} = RasController;
