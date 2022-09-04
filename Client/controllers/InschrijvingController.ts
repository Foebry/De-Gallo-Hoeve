import { ClientSession, Collection, MongoClient, ObjectId } from "mongodb";
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

export const getInschrijvingCollection = (client: MongoClient): Collection => {
  return client.db("degallohoeve").collection("inschrijving");
};

export const createInschrijving = async (
  client: MongoClient,
  inschrijving: NewInschrijving,
  session?: ClientSession
): Promise<InschrijvingCollection> => {
  const collection = getInschrijvingCollection(client);
  const { insertedId } = await collection.insertOne(inschrijving);

  const klantCollection = getKlantCollection(client);
  await klantCollection.updateOne(
    { _id: inschrijving.klant.id },
    { $addToSet: { inschrijvingen: insertedId } },
    { session }
  );

  const trainingCollection = getTrainingCollection(client);
  await trainingCollection.updateOne(
    { naam: inschrijving.training },
    { $addToSet: { inschrijvingen: insertedId } },
    { session }
  );

  return getInschrijvingById(client, insertedId);
};

export const getInschrijvingen = async (
  client: MongoClient
): Promise<InschrijvingCollection[]> => {
  const collection = getInschrijvingCollection(client);

  return (await collection.find().toArray()) as InschrijvingCollection[];
};

export const getInschrijvingById = async (
  client: MongoClient,
  _id: ObjectId
): Promise<InschrijvingCollection> => {
  const collection = getInschrijvingCollection(client);

  return (await collection.findOne({ _id })) as InschrijvingCollection;
};

export const getInschrijvingenByFilter = async (
  client: MongoClient,
  filter: any
): Promise<InschrijvingCollection[]> => {
  const collection = getInschrijvingCollection(client);

  return (await collection.find(filter).toArray()) as InschrijvingCollection[];
};

export const updateInschrijving = async (
  client: MongoClient,
  _id: ObjectId,
  data: UpdateInschrijving
): Promise<InschrijvingCollection> => {
  const collection = getInschrijvingCollection(client);
  const { training } = await getInschrijvingById(client, _id);
  const { upsertedId } = await collection.updateOne({ _id }, data);

  if (data.training && data.training !== training) {
    let filteredInschrijvingen: ObjectId[];
    const priveTraining = await getTrainingByNaam(client, "prive");
    const groepTraining = await getTrainingByNaam(client, "groep");

    if (training === "groep") {
      filteredInschrijvingen = groepTraining.inschrijvingen.filter(
        (inschrijving) => inschrijving !== upsertedId
      );
      const updatedGroepTraining = {
        ...groepTraining,
        inschrijvingen: filteredInschrijvingen,
      };
      await updateTraining(client, groepTraining._id, updatedGroepTraining);

      const updatedPriveTraining = {
        ...priveTraining,
        inschrijvingen: [...priveTraining.inschrijvingen, upsertedId],
      };
      await updateTraining(client, priveTraining._id, updatedPriveTraining);
    } else if (training === "prive") {
      filteredInschrijvingen = priveTraining.inschrijvingen.filter(
        (inschrijving) => inschrijving !== upsertedId
      );
      const updatedPriveTraining = {
        ...priveTraining,
        inschrijvingen: filteredInschrijvingen,
      };
      await updateTraining(client, priveTraining._id, updatedPriveTraining);

      const updatedGroepsTraining = {
        ...groepTraining,
        inschrijvingen: [...groepTraining.inschrijvingen, upsertedId],
      };
      await updateTraining(client, groepTraining._id, updatedGroepsTraining);
    }
  }

  return await getInschrijvingById(client, upsertedId);
};

export const deleteInschrijving = async (
  client: MongoClient,
  _id: ObjectId
): Promise<void> => {
  const collection = getInschrijvingCollection(client);
  await collection.deleteOne({ _id });
};

export const deleteInschrijvingen = async (
  client: MongoClient,
  inschrijvingen: ObjectId[]
): Promise<void> => {
  const collection = getInschrijvingCollection(client);
  await collection.deleteMany({ _id: { $in: inschrijvingen } });

  const priveTraining = await getTrainingByNaam(client, "prive");
  const groepsTraining = await getTrainingByNaam(client, "groep");
  let updatedInschrijvingen: ObjectId[];

  const inschrijvingenPriveTraining = priveTraining.inschrijvingen;
  updatedInschrijvingen = inschrijvingenPriveTraining.filter(
    (id) => !inschrijvingen.includes(id)
  );
  const updatedPriveTraining = {
    ...priveTraining,
    inschrijvingen: updatedInschrijvingen,
  };
  await updateTraining(
    client,
    priveTraining._id as ObjectId,
    updatedPriveTraining
  );

  const inschrijvingenGroepsTraining = groepsTraining.inschrijvingen;
  updatedInschrijvingen = inschrijvingenGroepsTraining.filter(
    (id) => !inschrijvingen.includes(id)
  );
  const updatedGroepsTraining = {
    ...groepsTraining,
    inschrijvingen: updatedInschrijvingen,
  };
  await updateTraining(
    client,
    groepsTraining._id as ObjectId,
    updatedGroepsTraining
  );
};
