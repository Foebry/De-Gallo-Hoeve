import { Collection, ObjectId } from "mongodb";
import client from "../middleware/MongoDb";
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

export const getTrainingCollection = (): Collection => {
  return client.db("degallohoeve").collection("training");
};

export const getTrainingById = async (
  _id: ObjectId
): Promise<GroepTrainingCollection | PriveTrainingCollection> => {
  const collection = getTrainingCollection();

  return (await collection.findOne({ _id })) as
    | GroepTrainingCollection
    | PriveTrainingCollection;
};

export const getTrainingByNaam = async (
  naam: string
): Promise<GroepTrainingCollection | PriveTrainingCollection> => {
  const collection = getTrainingCollection();

  return (await collection.findOne({ naam })) as
    | GroepTrainingCollection
    | PriveTrainingCollection;
};

export const updateTraining = async (
  _id: ObjectId,
  training: UpdateTraining
): Promise<GroepTrainingCollection | PriveTrainingCollection> => {
  const collection = getTrainingCollection();
  const { upsertedId } = await collection.updateOne({ _id }, training);

  return getTrainingById(upsertedId);
};

export const deleteTraining = async (
  _id: ObjectId,
  hardDelete = false
): Promise<void> => {
  const collection = getTrainingCollection();
  const training = await getTrainingById(_id);
  await collection.deleteOne({ _id: training._id });

  if (hardDelete) {
    let updatedInschrijvingen: ObjectId[];
    const inschrijvingen = training.inschrijvingen;
    const inschrijvingCollection = getInschrijvingCollection();
    await inschrijvingCollection.deleteMany({ _id: { $in: inschrijvingen } });

    const klantCollection = getKlantCollection();
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

        await updateKlant(klant._id as ObjectId, updatedKlant);
      })
    );
  }
};
