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
  kanInschrijvenTraining: (
    naam: string,
    datum: Date
  ) => Promise<boolean | null>;
  findOneBy: (collection: string, filter: object) => Promise<any | null>;
  getRasOptions: () => Promise<Option[] | null>;
  getHondOptions: (klant_id: ObjectId) => Promise<Option[]>;
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

  kanInschrijvenTraining: async (naam, datum) => {
    await client.connect();
    const { max_inschrijvingen, _id } = await findOneBy("training", {
      naam,
    });
    const filter =
      naam === "groep"
        ? {
            _id,
            inschrijvingen: {
              $elemMatch: { aantal: { $lt: max_inschrijvingen }, datum },
            },
          }
        : {
            _id,
            "inschrijvingen.datum": {
              $ne: datum,
            },
          };
    console.log({ filter });
    try {
      const training = await findOneBy("training", filter);
      return training ? true : false;
    } catch (e: any) {
      console.error(e.message);
      return null;
    } finally {
      await client.close();
    }
  },

  findOneBy: async (collection, filter) => {
    try {
      await client.connect();
      return await client
        .db("degallohoeve")
        .collection(collection)
        .findOne(filter);
    } catch (e: any) {
      return null;
    } finally {
      await client.close();
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
};

const client = new MongoClient(
  `mongodb+srv://degallohoeve:${process.env.MONGODB_PASSWORD}@cluster0.poasnun.mongodb.net/?retryWrites=true&w=majority`
);
export default client;
export const {
  getIndexData,
  kanInschrijvenTraining,
  findOneBy,
  getRasOptions,
  getHondOptions,
} = MongoDb;
