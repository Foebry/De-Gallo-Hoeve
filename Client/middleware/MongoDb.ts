import { MongoClient, ObjectId } from "mongodb";
import { atob } from "buffer";
import { Hond, Klant } from "../types/collections";

interface Result {
  value: ObjectId;
  label: string;
}
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
  findOneBy: (
    client: MongoClient,
    collection: string,
    filter: object
  ) => Promise<any | null>;
  getRasOptions: () => Promise<Option[] | null>;
  getHondOptions: (klant_id: ObjectId) => Promise<Option[]>;
  getCollections: (collections: string[]) => any;
  getFreeTimeSlots: () => Promise<any>;
}

const MongoDb: MongoDbInterface = {
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

  findOneBy: async (client, collection, filter) => {
    try {
      return await client
        .db("degallohoeve")
        .collection(collection)
        .findOne(filter);
    } catch (e: any) {
      await client.close();
      return null;
    } finally {
    }
  },

  getRasOptions: async () => {
    const aggregation = [
      { $project: { _id: 0, value: "$_id", label: "$naam" } },
    ];
    await client.connect();
    try {
      const result = (await client
        .db("degallohoeve")
        .collection("ras")
        .aggregate(aggregation)
        .toArray()) as Result[];
      return result.map((item: Result) => ({
        ...item,
        value: item.value.toString(),
      })) as Option[];
    } catch (e: any) {
      console.log({ error: e.message });
      return null;
    } finally {
      await client.close();
    }
  },

  getHondOptions: async (klant_id) => {
    try {
      await client.connect();
      const { honden } = (await client
        .db("degallohoeve")
        .collection("klant")
        .findOne({ _id: klant_id })) as Klant;
      return honden.map((item: Hond) => ({
        label: item.naam,
        value: item._id?.toString(),
      })) as Option[];
    } catch (e: any) {
      console.log(e.message);
    } finally {
      await client.close();
    }
    return [];
  },

  getCollections: (collections) => {
    return collections.reduce((prev, curr) => {
      return {
        ...prev,
        [curr + "Collection"]: client.db("degallohoeve").collection(curr),
      };
    }, {});
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
    const inschrijvingen = await client
      .db("degallohoeve")
      .collection("inschrijving")
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
};

const client = new MongoClient(
  `mongodb+srv://degallohoeve:${process.env.MONGODB_PASSWORD}@cluster0.poasnun.mongodb.net/?retryWrites=true&w=majority`
);
export default client;
export const {
  getIndexData,
  findOneBy,
  getRasOptions,
  getHondOptions,
  getCollections,
  getFreeTimeSlots,
} = MongoDb;
