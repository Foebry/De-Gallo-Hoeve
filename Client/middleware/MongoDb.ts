import {
  MongoClient,
  ObjectId,
  ReadPreference,
  TransactionOptions,
} from "mongodb";
import { atob } from "buffer";
import { getAllRassen, RAS } from "../controllers/rasController";
import { getHondenByKlantId } from "../controllers/HondController";
import Factory from "./Factory";
import { KLANT } from "../controllers/KlantController";
import { CONFIRM } from "../types/EntityTpes/ConfirmTypes";
import { CONTENT } from "../controllers/ContentController";
import {
  getInschrijvingCollection,
  INSCHRIJVING,
} from "../controllers/InschrijvingController";
import { TRAINING } from "../controllers/TrainingController";
import moment from "moment";

export interface Option {
  value: string;
  label: string;
}

interface MongoDbInterface {
  getIndexData: () => Promise<{
    wie: string[];
    privetraining: string[];
    groepstraining: string[];
  }>;
  getRasOptions: () => Promise<Option[] | null>;
  getHondOptions: (klant_id: ObjectId) => Promise<Option[]>;
  getFreeTimeSlots: () => Promise<any>;
  startTransaction: () => TransactionOptions;
  clearAllData: () => Promise<void>;
  status: "open" | "closed";
}

export const MongoDb: MongoDbInterface = {
  getIndexData: async () => {
    try {
      await client.connect();
      const data = await client
        .db("degallohoeve")
        .collection("content")
        .find({
          _id: {
            $in: [
              new ObjectId("62fa1f25bacc03711136ad59"),
              new ObjectId("62fa1f25bacc03711136ad5e"),
              new ObjectId("62fa1f25bacc03711136ad5d"),
            ],
          },
        })
        .toArray();
      return {
        wie: atob(data[0].content).split("\n"),
        privetraining: atob(data[1].content).split("\n"),
        groepstraining: atob(data[2].content).split("\n"),
      };
    } catch (e: any) {
      console.error(e.message);
      return { wie: [], privetraining: [], groepstraining: [] };
    } finally {
      await client.close();
    }
  },

  getRasOptions: async () => {
    await client.connect();
    const rassen = await getAllRassen();
    return rassen.map(({ _id: value, naam: label }) => ({
      value: value.toString(),
      label,
    })) as Option[];
  },

  getHondOptions: async (klant_id) => {
    const honden = await getHondenByKlantId(klant_id);
    return honden.map(({ _id: value, naam: label }) => ({
      value: value?.toString(),
      label,
    })) as Option[];
  },

  getFreeTimeSlots: async () => {
    const all = [
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ].map((el) => ({ label: el, value: el }));
    await client.connect();
    const inschrijvingen = await getInschrijvingCollection()
      .find({ training: "prive", datum: { $gt: new Date() } })
      .toArray();
    await client.close();

    const timeSlots = inschrijvingen.reduce((prev, curr) => {
      const [date, time] = curr.datum.toISOString().split("T");
      const keys = Object.keys(prev);
      if (keys.includes(date)) {
        return {
          ...prev,
          [date]: prev[date].filter(
            (el: Option) => el.label !== time.substring(0, 5)
          ),
        };
      } else
        return {
          ...prev,
          [date]: all.filter((el: Option) => el.label !== time.substring(0, 5)),
        };
    }, {} as any);
    return {
      ...timeSlots,
      default: all,
    };
  },
  startTransaction: () => {
    const transactionOptions = {
      readPreference: ReadPreference.primary,
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
    } as TransactionOptions;

    return transactionOptions;
  },
  clearAllData: async () => {
    if (process.env.NODE_ENV === "test") {
      await process.nextTick(() => {});
      await client.connect();
      await process.nextTick(() => {});
      await Factory.getController(CONFIRM).deleteAll();
      await process.nextTick(() => {});
      await Factory.getController(KLANT).deleteAll();
      await process.nextTick(() => {});
      await Factory.getController(CONTENT).deleteAll();
      await process.nextTick(() => {});
      await Factory.getController(INSCHRIJVING).deleteAll();
      await process.nextTick(() => {});
      await Factory.getController(RAS).deleteAll();
      await process.nextTick(() => {});
      await Factory.getController(TRAINING).deleteAll();
      await client.close();
    }
  },
  status: "closed",
};

const client = new MongoClient(
  `mongodb+srv://degallohoeve:${process.env.MONGODB_PASSWORD}@cluster0.poasnun.mongodb.net/?retryWrites=true&w=majority`
);

client.on("open", () => (MongoDb.status = "open"));
client.on("connectionClosed", () => (MongoDb.status = "closed"));

export default client;
export const {
  getIndexData,
  getRasOptions,
  getHondOptions,
  getFreeTimeSlots,
  startTransaction,
  clearAllData,
} = MongoDb;
