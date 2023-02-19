import { InschrijvingCollection } from '@/types/EntityTpes/InschrijvingTypes';
import { TrainingDaysCollection } from '@/types/EntityTpes/TrainingType';
import { ClientSession } from 'mongodb';
import { removeInschrijving as removeInschrijvingFromKlant } from 'src/controllers/KlantController';
import { removeInschrijving as removeInschrijvingFromTraining } from 'src/controllers/TrainingController';
import { getCurrentTime } from 'src/shared/functions';
import { TransactionError } from 'src/shared/RequestError';
import {
  getInschrijvingCollection,
  getTrainingDaysCollection,
  startSession,
  startTransaction,
} from 'src/utils/db';

export const softDelete = async (
  inschrijving: InschrijvingCollection,
  session?: ClientSession
) => {
  const collection = await getInschrijvingCollection();
  const deletedInschrijving = { ...inschrijving, deleted_at: getCurrentTime() };
  await collection.updateOne(
    { _id: inschrijving._id },
    { $set: deletedInschrijving },
    { session }
  );
};

export const cancelInschrijving = async (inschrijving: InschrijvingCollection) => {
  const session = await startSession();
  const transactionOptions = startTransaction();

  try {
    await session.withTransaction(async () => {
      await softDelete(inschrijving, session);
      await removeInschrijvingFromTraining('prive', inschrijving, session);
      await removeInschrijvingFromKlant(inschrijving.klant.id, inschrijving._id, session);
    }, transactionOptions);
  } catch (error: any) {
    console.log(error);
    throw new TransactionError('TransactionError', 422, {
      message: 'Something went wrong cancelling inschrijving',
    });
  }
};

export const getEnabledTrainingDays = async (): Promise<TrainingDaysCollection[]> => {
  const collection = await getTrainingDaysCollection();
  return collection.find({ date: { $gt: new Date() } }, { sort: { date: 1 } }).toArray();
};
