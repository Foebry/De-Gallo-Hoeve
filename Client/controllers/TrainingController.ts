import moment from "moment";
import { ClientSession, Collection, ObjectId } from "mongodb";
import { CASCADEKLANT } from "../middlewares/Factory";
import client from "../middlewares/MongoDb";
import { InternalServerError } from "../middlewares/RequestError";
import {
  InschrijvingCollection,
  IsInschrijving,
} from "../types/EntityTpes/InschrijvingTypes";
import { IsKlantCollection } from "../types/EntityTpes/KlantTypes";
import {
  GroepTrainingCollection,
  PriveTrainingCollection,
  TrainingType,
  UpdateTraining,
} from "../types/EntityTpes/TrainingType";
import { IsInschrijvingBodyInschrijving } from "../types/requestTypes";
import {
  deleteInschrijvingen,
  getInschrijvingById,
  getInschrijvingCollection,
} from "./InschrijvingController";

export interface IsTrainingController {
  getTrainingCollection: () => Collection;
  getTrainingDaysCollection: () => Collection;
  getTrainingById: typeof getTrainingById;
  getTrainingByName: typeof getTrainingByName;
  updateTraining: typeof updateTraining;
  addTrainingInschrijving: (
    training: string,
    inschrijving: InschrijvingCollection,
    session?: ClientSession
  ) => Promise<void>;
  delete: (_id: ObjectId) => Promise<void>;
  deleteInschrijving: (
    training: string,
    inschrijving_id: ObjectId,
    session?: ClientSession
  ) => Promise<void>;
  klantReedsIngeschreven: (
    klant: IsKlantCollection,
    training: TrainingType,
    inschrijving: IsInschrijvingBodyInschrijving
  ) => Promise<boolean>;
  trainingVolzet: (training: TrainingType, datum: string) => Promise<boolean>;
  deleteAll: () => Promise<void>;
}

const TrainingController: IsTrainingController = {
  getTrainingCollection: () => {
    const database = process.env.MONGODB_DATABASE;
    return client.db(database).collection("training");
  },
  getTrainingDaysCollection: () => {
    const database = process.env.MONGODB_DATABASE;
    return client.db(database).collection("trainingDays");
  },
  getTrainingById,
  getTrainingByName,
  updateTraining,
  addTrainingInschrijving: async (training, inschrijving, session) => {
    await getTrainingByName(training);
    const { modifiedCount } = await getTrainingCollection().updateOne(
      { naam: training },
      { $addToSet: { inschrijvingen: inschrijving._id } },
      { session }
    );
    if (modifiedCount !== 1) throw new InternalServerError();
  },
  delete: async (_id) => {
    const training = await getTrainingById(_id);
    const { deletedCount } = await getTrainingCollection().deleteOne({ _id });
    if (deletedCount !== 1) throw new InternalServerError();

    const inschrijvingen = await Promise.all(
      training.inschrijvingen.map(
        async (_id) => await getInschrijvingById(_id, false)
      )
    );
    await deleteInschrijvingen(inschrijvingen, CASCADEKLANT);
  },
  deleteInschrijving: async (training, inschrijving_id, session) => {
    await getTrainingByName(training);
    await getInschrijvingById(inschrijving_id);
    const {} = await getTrainingCollection().updateOne(
      { naam: training },
      { $pull: { inschrijvingen: inschrijving_id } },
      { session }
    );
  },
  klantReedsIngeschreven: async (klant, training, inschrijving) => {
    const inschrijvingFound = await getInschrijvingCollection().findOne({
      datum: moment(inschrijving.datum).local().toDate(),
      training,
      "klant.id": klant._id,
    });
    return inschrijvingFound ? true : false;
  },
  trainingVolzet: async (training, datum) => {
    const Training = await getTrainingByName(training);
    const inschrijvingen = await getInschrijvingCollection()
      .find({ datum: moment(datum).local().toDate() })
      .toArray();
    if (training === "groep")
      return inschrijvingen.length >= Training.max_inschrijvingen;
    return inschrijvingen.length > 0;
  },
  deleteAll: async () => {
    const ids = (await getTrainingCollection().find().toArray()).map(
      (item) => item._id
    );
    await getTrainingCollection().deleteMany({ _id: { $in: [...ids] } });
  },
};

export default TrainingController;
export const TRAINING = "TrainingController";
export const {
  getTrainingCollection,
  getTrainingDaysCollection,
  deleteInschrijving,
  addTrainingInschrijving,
  klantReedsIngeschreven,
  trainingVolzet,
} = TrainingController;

export async function getTrainingByName(
  naam: string
): Promise<GroepTrainingCollection>;
export async function getTrainingByName(
  naam: string
): Promise<PriveTrainingCollection>;
export async function getTrainingByName(naam: string) {
  const training = await getTrainingCollection().findOne({ naam });
  if (training && naam === "groep") return training as GroepTrainingCollection;
  else if (training && naam === "prive")
    return training as PriveTrainingCollection;
}

export const getPriveTraining = async () => {
  return getTrainingCollection().findOne({
    naam: "prive",
  }) as Promise<PriveTrainingCollection>;
};

export async function getTrainingById(
  _id: ObjectId
): Promise<PriveTrainingCollection>;
export async function getTrainingById(
  _id: ObjectId
): Promise<GroepTrainingCollection>;
export async function getTrainingById(_id: ObjectId) {
  const training = (await getTrainingCollection().findOne({ _id })) as
    | PriveTrainingCollection
    | GroepTrainingCollection;
  if (training.naam === "groep") return training as GroepTrainingCollection;
  else if (training.naam === "prive")
    return training as PriveTrainingCollection;
}

export async function updateTraining(
  _id: ObjectId,
  updateData: UpdateTraining
): Promise<GroepTrainingCollection>;
export async function updateTraining(
  _id: ObjectId,
  updateData: UpdateTraining
): Promise<PriveTrainingCollection>;
export async function updateTraining(
  _id: ObjectId,
  updateData: UpdateTraining
) {
  const training = await getTrainingById(_id);
  const updateTraining = { ...training, ...updateData };
  const { upsertedCount } = await getTrainingCollection().updateOne(
    { _id },
    updateTraining
  );
  if (upsertedCount !== 1) throw new InternalServerError();
  return await getTrainingById(_id);
}
