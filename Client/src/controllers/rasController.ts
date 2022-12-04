import { Collection, ObjectId } from "mongodb";
import { getConnection } from "src/utils/MongoDb";
import {
  InternalServerError,
  RasNotFoundError,
} from "../shared/RequestError";
import { RasCollection, UpdateRas } from "../types/EntityTpes/RasTypes";

export interface IsRasController {
  getRasCollection: () => Promise<Collection>;
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
  getRasCollection: async () => {
    const database = process.env.MONGODB_DATABASE;
    const client = await getConnection();
    return client.db(database).collection("ras");
  },
  getRasByName: async (naam) => {
    const collection = await getRasCollection();
    return collection.findOne({ naam }) as Promise<RasCollection>;
  },
  save: async (ras) => {
    const collection = await getRasCollection();
    const { insertedId } = await collection.insertOne(ras);
    if (!insertedId) throw new InternalServerError();

    return await getRasById(insertedId);
  },
  getRasById: async (_id, breakEarly = true) => {
    const collection = await getRasCollection();
    const ras = await collection.findOne({ _id });
    if (!ras && breakEarly) throw new RasNotFoundError();
    return ras as RasCollection;
  },
  getAllRassen: async () => {
    const collection = await getRasCollection();
    return (await collection.find().toArray()) as RasCollection[];
  },
  update: async (_id, updateRas) => {
    const collection = await getRasCollection();
    await getRasById(_id);
    const { upsertedCount } = await collection.updateOne({ _id }, updateRas);
    if (upsertedCount !== 1) throw new InternalServerError();
    return await getRasById(_id);
  },
  delete: async (_id) => {
    const collection = await getRasCollection();
    const ras = await getRasById(_id);
    const { deletedCount } = await collection.deleteOne(ras);
    if (deletedCount !== 1) throw new InternalServerError();
  },
  deleteAll: async () => {
    const collection = await getRasCollection();
    const ids = (await collection.find().toArray()).map((item) => item._id);
    await collection.deleteMany({ _id: { $in: [...ids] } });
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
