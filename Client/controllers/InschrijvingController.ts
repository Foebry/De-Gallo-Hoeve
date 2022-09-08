import { ClientSession, Collection, ObjectId } from "mongodb";
import client from "../middleware/MongoDb";
import { getKlantCollection } from "./KlantController";
import {
  getTrainingByNaam,
  getTrainingCollection,
  TrainingType,
  updateTraining,
} from "./TrainingController";

export interface NewInschrijving {
  datum: Date;
  training: TrainingType;
  hond: {
    id: ObjectId;
    naam: string;
  };
  klant: {
    id: ObjectId;
    vnaam: string;
    lnaam: string;
  };
}

export interface InschrijvingCollection extends NewInschrijving {
  _id: ObjectId;
  created_at: Date;
}

interface UpdateInschrijving {
  datum?: Date;
  training?: TrainingType;
  hond?: {
    id: ObjectId;
    naam: string;
  };
}

export const getInschrijvingCollection = (): Collection => {
  return client.db("degallohoeve").collection("inschrijving");
};

export const createInschrijving = async (
  inschrijving: NewInschrijving,
  session?: ClientSession
): Promise<InschrijvingCollection> => {
  const collection = getInschrijvingCollection();
  const { insertedId } = await collection.insertOne(inschrijving);

  const klantCollection = getKlantCollection();
  await klantCollection.updateOne(
    { _id: inschrijving.klant.id },
    { $addToSet: { inschrijvingen: insertedId } },
    { session }
  );

  const trainingCollection = getTrainingCollection();
  await trainingCollection.updateOne(
    { naam: inschrijving.training },
    { $addToSet: { inschrijvingen: insertedId } },
    { session }
  );

  return getInschrijvingById(insertedId);
};

export const getInschrijvingen = async (): Promise<
  InschrijvingCollection[]
> => {
  const collection = getInschrijvingCollection();

  return (await collection.find().toArray()) as InschrijvingCollection[];
};

export const getInschrijvingById = async (
  _id: ObjectId
): Promise<InschrijvingCollection> => {
  const collection = getInschrijvingCollection();

  return (await collection.findOne({ _id })) as InschrijvingCollection;
};

export const getInschrijvingenByFilter = async (
  filter: any
): Promise<InschrijvingCollection[]> => {
  const collection = getInschrijvingCollection();

  return (await collection.find(filter).toArray()) as InschrijvingCollection[];
};

export const updateInschrijving = async (
  _id: ObjectId,
  data: UpdateInschrijving
): Promise<InschrijvingCollection> => {
  const collection = getInschrijvingCollection();
  const { training } = await getInschrijvingById(_id);
  const { upsertedId } = await collection.updateOne({ _id }, data);

  if (data.training && data.training !== training) {
    let filteredInschrijvingen: ObjectId[];
    const priveTraining = await getTrainingByNaam("prive");
    const groepTraining = await getTrainingByNaam("groep");

    if (training === "groep") {
      filteredInschrijvingen = groepTraining.inschrijvingen.filter(
        (inschrijving) => inschrijving !== upsertedId
      );
      const updatedGroepTraining = {
        ...groepTraining,
        inschrijvingen: filteredInschrijvingen,
      };
      await updateTraining(groepTraining._id, updatedGroepTraining);

      const updatedPriveTraining = {
        ...priveTraining,
        inschrijvingen: [...priveTraining.inschrijvingen, upsertedId],
      };
      await updateTraining(priveTraining._id, updatedPriveTraining);
    } else if (training === "prive") {
      filteredInschrijvingen = priveTraining.inschrijvingen.filter(
        (inschrijving) => inschrijving !== upsertedId
      );
      const updatedPriveTraining = {
        ...priveTraining,
        inschrijvingen: filteredInschrijvingen,
      };
      await updateTraining(priveTraining._id, updatedPriveTraining);

      const updatedGroepsTraining = {
        ...groepTraining,
        inschrijvingen: [...groepTraining.inschrijvingen, upsertedId],
      };
      await updateTraining(groepTraining._id, updatedGroepsTraining);
    }
  }

  return await getInschrijvingById(upsertedId);
};

export const deleteInschrijving = async (_id: ObjectId): Promise<void> => {
  const collection = getInschrijvingCollection();
  await collection.deleteOne({ _id });
};

export const deleteInschrijvingen = async (
  inschrijvingen: ObjectId[]
): Promise<void> => {
  const collection = getInschrijvingCollection();
  await collection.deleteMany({ _id: { $in: inschrijvingen } });

  const priveTraining = await getTrainingByNaam("prive");
  const groepsTraining = await getTrainingByNaam("groep");
  let updatedInschrijvingen: ObjectId[];

  const inschrijvingenPriveTraining = priveTraining.inschrijvingen;
  updatedInschrijvingen = inschrijvingenPriveTraining.filter(
    (id) => !inschrijvingen.includes(id)
  );
  const updatedPriveTraining = {
    ...priveTraining,
    inschrijvingen: updatedInschrijvingen,
  };
  await updateTraining(priveTraining._id as ObjectId, updatedPriveTraining);

  const inschrijvingenGroepsTraining = groepsTraining.inschrijvingen;
  updatedInschrijvingen = inschrijvingenGroepsTraining.filter(
    (id) => !inschrijvingen.includes(id)
  );
  const updatedGroepsTraining = {
    ...groepsTraining,
    inschrijvingen: updatedInschrijvingen,
  };
  await updateTraining(groepsTraining._id as ObjectId, updatedGroepsTraining);
};
