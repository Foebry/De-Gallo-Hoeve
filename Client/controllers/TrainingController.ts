import { Collection, MongoClient, ObjectId } from "mongodb";
import { getInschrijvingCollection } from "./InschrijvingController";
import {
  getKlantCollection,
  KlantCollection,
  updateKlant,
} from "./KlantController";

export type TrainingType = "prive" | "groep";

export interface PriveTrainingCollection {
  _id: ObjectId;
  naam: TrainingType;
  prijs: number;
  inschrijvingen: ObjectId[];
}

export interface GroepTrainingCollection extends PriveTrainingCollection {
  max_inschrijvingen: number;
}

export interface UpdateTraining {
  naam?: TrainingType;
  prijs?: number;
  inschrijvingen?: ObjectId[];
  max_inschrijvingen?: number;
}

export const getTrainingCollection = (client: MongoClient): Collection => {
  return client.db("degallohoeve").collection("training");
};

export const getTrainingById = async (
  client: MongoClient,
  _id: ObjectId
): Promise<GroepTrainingCollection | PriveTrainingCollection> => {
  const collection = getTrainingCollection(client);

  return (await collection.findOne({ _id })) as
    | GroepTrainingCollection
    | PriveTrainingCollection;
};

export const getTrainingByNaam = async (
  client: MongoClient,
  naam: string
): Promise<GroepTrainingCollection | PriveTrainingCollection> => {
  const collection = getTrainingCollection(client);

  return (await collection.findOne({ naam })) as
    | GroepTrainingCollection
    | PriveTrainingCollection;
};

export const updateTraining = async (
  client: MongoClient,
  _id: ObjectId,
  training: UpdateTraining
): Promise<GroepTrainingCollection | PriveTrainingCollection> => {
  const collection = getTrainingCollection(client);
  const { upsertedId } = await collection.updateOne({ _id }, training);

  return getTrainingById(client, upsertedId);
};

export const deleteTraining = async (
  client: MongoClient,
  _id: ObjectId,
  hardDelete = false
): Promise<void> => {
  const collection = getTrainingCollection(client);
  const training = await getTrainingById(client, _id);
  await collection.deleteOne({ _id: training._id });

  if (hardDelete) {
    let updatedInschrijvingen: ObjectId[];
    const inschrijvingen = training.inschrijvingen;
    const inschrijvingCollection = getInschrijvingCollection(client);
    await inschrijvingCollection.deleteMany({ _id: { $in: inschrijvingen } });

    const klantCollection = getKlantCollection(client);
    const filter = { inschrijvinge: { $in: inschrijvingen } };
    const klanten = (await klantCollection
      .find({ filter })
      .toArray()) as KlantCollection[];

    await Promise.all(
      klanten.map(async (klant) => {
        updatedInschrijvingen = klant.inschrijvingen.filter(
          (id) => !inschrijvingen.includes(id)
        );
        const updatedKlant = {
          ...klant,
          inschrijvingen: updatedInschrijvingen,
        };

        await updateKlant(client, klant._id as ObjectId, updatedKlant);
      })
    );
  }
};
