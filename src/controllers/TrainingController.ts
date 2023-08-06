import moment from 'moment';
import { ClientSession, ObjectId } from 'mongodb';
import { InternalServerError, TransactionError } from '../shared/RequestError';
import { InschrijvingCollection } from '../types/EntityTpes/InschrijvingTypes';
import { IsKlantCollection } from '../types/EntityTpes/KlantTypes';
import {
  GroepTrainingCollection,
  PriveTrainingCollection,
  TrainingType,
} from '../types/EntityTpes/TrainingType';
import inschrijvingController, { getInschrijvingById } from './InschrijvingController';
import { notEmpty } from 'src/shared/RequestHelper';
import { getInschrijvingCollection, getTrainingCollection } from 'src/utils/db';
import { getCurrentTime } from 'src/shared/functions';

export async function getTrainingByName(
  naam: TrainingType
): Promise<GroepTrainingCollection | PriveTrainingCollection | null>;
export async function getTrainingByName(
  naam: TrainingType
): Promise<GroepTrainingCollection | PriveTrainingCollection | null>;
export async function getTrainingByName(naam: TrainingType) {
  const collection = await getTrainingCollection();
  const training = await collection.findOne({ naam });
  if (!training) return null;
  if (training && naam === 'groep') return training as GroepTrainingCollection;
  return training as PriveTrainingCollection;
}

export const getPriveTraining = async () => {
  const collection = await getTrainingCollection();
  return collection.findOne({
    naam: 'prive',
  });
};

export async function getTrainingById(
  _id: ObjectId
): Promise<PriveTrainingCollection | GroepTrainingCollection | null>;
export async function getTrainingById(
  _id: ObjectId
): Promise<PriveTrainingCollection | GroepTrainingCollection | null>;
export async function getTrainingById(
  _id: ObjectId
): Promise<GroepTrainingCollection | PriveTrainingCollection | null> {
  const collection = await getTrainingCollection();
  const training = await collection.findOne({ _id });
  if (!training) return null;
  if (training.naam === 'groep') return training as GroepTrainingCollection;
  return training as PriveTrainingCollection;
}

export const addInschrijving = async (
  training: TrainingType,
  inschrijving: InschrijvingCollection,
  session?: ClientSession
): Promise<void> => {
  const collection = await getTrainingCollection();
  try {
    await collection.updateOne(
      {
        naam: training,
      },
      {
        $addToSet: { inschrijvingen: inschrijving._id },
        $set: { updated_at: getCurrentTime() },
      },
      { session }
    );
  } catch (e: any) {
    throw new TransactionError('TransactionError', 500, {
      ...e,
      message: 'Er is iets fout gegaan',
    });
  }
};

export const removeInschrijving = async (
  training: TrainingType,
  inschrijving: InschrijvingCollection,
  session?: ClientSession
): Promise<void> => {
  const collection = await getTrainingCollection();
  await collection.updateOne(
    { naam: training },
    {
      $pull: { inschrijvingen: inschrijving._id },
      $set: { updated_at: getCurrentTime() },
    },
    { session }
  );
  // if (modifiedCount !== 1) throw new InternalServerError();
};

export const hardDelete = async (training: PriveTrainingCollection): Promise<void> => {
  const collection = await getTrainingCollection();
  const inschrijvingIds = training.inschrijvingen;

  const { deletedCount } = await collection.deleteOne({ training });
  if (deletedCount !== 1) throw new InternalServerError();

  const inschrijvingen = await Promise.all(
    inschrijvingIds.map((_id) => getInschrijvingById(_id))
  );
  await Promise.all(
    inschrijvingen
      .filter(notEmpty)
      .map((inschrijving) => inschrijvingController.softDelete(inschrijving))
  );
};

export const softDelete = async (training: PriveTrainingCollection): Promise<void> => {
  const collection = await getTrainingCollection();
  const inschrijvingIds = training.inschrijvingen;

  const deletedTraining = { ...training, deleted_at: getCurrentTime() };
  const { modifiedCount } = await collection.updateOne(
    { _id: training._id },
    deletedTraining
  );
  if (modifiedCount !== 1) throw new InternalServerError();

  const inschrijvingen = await Promise.all(
    inschrijvingIds.map((_id) => getInschrijvingById(_id))
  );
  await Promise.all(
    inschrijvingen
      .filter(notEmpty)
      .map((inschrijving) => inschrijvingController.softDelete(inschrijving))
  );
};

export const klantReedsIngeschreven = async (
  klant: IsKlantCollection,
  training: TrainingType,
  inschrijving: InschrijvingCollection
): Promise<boolean> => {
  const collection = await getInschrijvingCollection();
  const inschrijvingFound = await collection.findOne({
    datum: moment(inschrijving.datum).local().toDate(),
    training,
    'klant.id': klant._id,
    deleted_at: undefined,
  });

  return inschrijvingFound ? true : false;
};

export const trainingVolzet = async (
  training: GroepTrainingCollection | PriveTrainingCollection,
  datum: Date
): Promise<boolean> => {
  const inschrijvingCollection = await getInschrijvingCollection();
  const inschrijvingen = await inschrijvingCollection
    .find({ datum: moment(datum).local().toDate(), deleted_at: undefined })
    .toArray();

  if (training.naam === 'groep')
    return (
      inschrijvingen.length >= (training as GroepTrainingCollection)!.max_inschrijvingen
    );
  return inschrijvingen.length > 0;
};

export async function update(
  _id: ObjectId,
  updateData: GroepTrainingCollection
): Promise<GroepTrainingCollection | PriveTrainingCollection>;
export async function update(
  _id: ObjectId,
  updateData: PriveTrainingCollection
): Promise<PriveTrainingCollection>;
export async function update(
  _id: ObjectId,
  updateData: GroepTrainingCollection | PriveTrainingCollection
) {
  const collection = await getTrainingCollection();
  const training = await getTrainingById(_id);
  const updateTraining = { ...training, ...updateData };
  const { upsertedCount } = await collection.updateOne({ _id }, updateTraining);
  if (upsertedCount !== 1) throw new InternalServerError();

  return updateData;
}

const deleteAll = async (): Promise<void> => {
  const collection = await getTrainingCollection();

  await collection.deleteMany({});
};

const save = async (
  training: GroepTrainingCollection | PriveTrainingCollection
): Promise<GroepTrainingCollection | PriveTrainingCollection> => {
  const collection = await getTrainingCollection();

  await collection.insertOne(training);

  return training;
};

const trainingController: IsTrainingController = {
  getTrainingById,
  getTrainingByName,
  getPriveTraining,
  addInschrijving,
  update,
  hardDelete,
  softDelete,
  deleteAll,
  klantReedsIngeschreven,
  trainingVolzet,
  save,
};

export type IsTrainingController = {
  getTrainingById: (
    _id: ObjectId
  ) => Promise<GroepTrainingCollection | PriveTrainingCollection | null>;
  getTrainingByName: (
    name: TrainingType
  ) => Promise<PriveTrainingCollection | GroepTrainingCollection | null>;
  getPriveTraining: () => Promise<PriveTrainingCollection | null>;
  addInschrijving: (
    trainingName: TrainingType,
    inschrijving: InschrijvingCollection,
    session: ClientSession
  ) => Promise<void>;
  update: (
    _id: ObjectId,
    data: GroepTrainingCollection | PriveTrainingCollection
  ) => Promise<GroepTrainingCollection | PriveTrainingCollection>;
  hardDelete: (training: PriveTrainingCollection) => Promise<void>;
  softDelete: (training: PriveTrainingCollection) => Promise<void>;
  deleteAll: () => Promise<void>;
  klantReedsIngeschreven: (
    klant: IsKlantCollection,
    training: TrainingType,
    inschrijving: InschrijvingCollection
  ) => Promise<boolean>;
  trainingVolzet: (
    trainingName: GroepTrainingCollection | PriveTrainingCollection,
    datum: Date
  ) => Promise<boolean>;
  save: (
    training: GroepTrainingCollection | PriveTrainingCollection
  ) => Promise<GroepTrainingCollection | PriveTrainingCollection>;
};

export default trainingController;
export const TRAINING = 'TrainingController';
