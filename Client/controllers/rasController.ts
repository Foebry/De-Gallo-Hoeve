import { Collection, ObjectId } from "mongodb";
import client from "../middleware/MongoDb";
import {
  InternalServerError,
  RasNotFoundError,
} from "../middleware/RequestError";

interface NewRas {
  naam: string;
  soort: string;
}

export interface RasCollection extends NewRas {
  _id: ObjectId;
  created_at: Date;
}

interface UpdateRas {
  naam?: string;
  soort?: string;
}

export interface IsRasController {
  getRasCollection: () => Collection;
  save: (ras: RasCollection) => Promise<RasCollection>;
  getAllRassen: () => Promise<RasCollection[]>;
  getRasById: (_id: ObjectId, breakEarly?: boolean) => Promise<RasCollection>;
  update: (_id: ObjectId, updateRas: UpdateRas) => Promise<RasCollection>;
  delete: (ras: ObjectId) => Promise<void>;
}

const RasController: IsRasController = {
  getRasCollection: () => client.db("degallohoeve").collection("ras"),
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
};

export default RasController;
export const RAS = "RasController";
export const { getRasCollection, getRasById, getAllRassen } = RasController;
