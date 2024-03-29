import {
  Collection,
  MongoClient,
  ReadPreference,
  TransactionOptions,
  ReadConcernLevel,
  ClientSession,
  MongoClientOptions,
} from 'mongodb';
import { IsKlantCollection } from 'src/common/domain/klant';
import { ConfirmCollection } from 'src/types/EntityTpes/ConfirmTypes';
import { ContentCollection } from 'src/types/EntityTpes/ContentTypes';
import { ErrorLogCollection } from 'src/types/EntityTpes/ErrorLogTypes';
import { InschrijvingCollection } from 'src/types/EntityTpes/InschrijvingTypes';
import { RasCollection } from 'src/types/EntityTpes/RasTypes';
import { FeedBackCollection } from 'src/entities/Feedback';
import {
  GroepTrainingCollection,
  PriveTrainingCollection,
  TrainingDaysCollection,
} from 'src/types/EntityTpes/TrainingType';
import Vacation from 'src/common/domain/entities/Vacation';

export type CollectionOptions = {
  includeDeleted?: boolean;
};

export let client: MongoClient | null = null;

const { URI, MONGODB_DATABASE: DATABASE } = process.env;
const options: MongoClientOptions = {};
export const FEEDBACK = 'feedbackController';

export const connectClient = async () => {
  if (client === null) {
    client = new MongoClient(URI!, options);
    try {
      await client.connect();
    } catch (e: any) {}
  }
  return client;
};

export const closeClient = async () => {
  if (!client) return;
  const clientToClose = client;
  client = null;
  try {
    await clientToClose.close();
  } catch (e: any) {}
};

/**
 * This function will give you access to a collection of your choice, however, there will be no type-safety on this collection.
 * Therefor this function should b used ONLY in test cases when you are absolutely certain this is the correct function to use.
 *
 * An example of a scenario to use this function: -- test of script to add new key to collection. For customer-feedback, we wanted to implement a configuration to keep track of which email to send.
 * However the typings were already in place so testing the script was pointless as all newly created test-klanten would already have the required key --
 *
 * @returns *untyped* collection
 */
export const getUntypedCollection = async (collection: string): Promise<Collection> => {
  const client = await connectClient();
  return client.db(DATABASE).collection(collection);
};

export const getConfirmCollection = async (): Promise<Collection<ConfirmCollection>> => {
  const client = await connectClient();
  return client.db(DATABASE).collection<ConfirmCollection>('confirm');
};

export const getContentCollection = async (): Promise<Collection<ContentCollection>> => {
  const client = await connectClient();
  return client.db(DATABASE).collection<ContentCollection>('content');
};

export const getErrorLogCollection = async (): Promise<
  Collection<ErrorLogCollection>
> => {
  const client = await connectClient();
  return client.db(DATABASE).collection<ErrorLogCollection>('ErrorLog');
};

export const getInschrijvingCollection = async (): Promise<
  Collection<InschrijvingCollection>
> => {
  const client = await connectClient();
  return client.db(DATABASE).collection<InschrijvingCollection>('inschrijving');
};

export const getKlantCollection = async (): Promise<Collection<IsKlantCollection>> => {
  const client = await connectClient();
  return client.db(DATABASE).collection<IsKlantCollection>('klant');
};

export const getRasCollection = async (): Promise<Collection<RasCollection>> => {
  const client = await connectClient();
  return client.db(DATABASE).collection<RasCollection>('ras');
};

export const getTrainingCollection = async (): Promise<
  Collection<PriveTrainingCollection | GroepTrainingCollection>
> => {
  const client = await connectClient();
  return client
    .db(DATABASE)
    .collection<PriveTrainingCollection | GroepTrainingCollection>('training');
};

export const getTrainingDaysCollection = async (): Promise<
  Collection<TrainingDaysCollection>
> => {
  const client = await connectClient();
  return client.db(DATABASE).collection<TrainingDaysCollection>('trainingDays');
};

export const getFeedbackCollection = async (): Promise<
  Collection<FeedBackCollection>
> => {
  const client = await connectClient();
  return client.db(DATABASE).collection<FeedBackCollection>('feedback');
};

export const getVacationCollection = async (): Promise<Collection<Vacation>> => {
  const client = await connectClient();
  return client.db(DATABASE).collection<Vacation>('vacation');
};

export const startTransaction = (): TransactionOptions => {
  const transactionOptions: TransactionOptions = {
    readPreference: ReadPreference.primary,
    readConcern: { level: ReadConcernLevel.local },
    writeConcern: { w: 'majority' },
  };

  return transactionOptions;
};

export const startSession = async (): Promise<ClientSession> => {
  const client = await connectClient();
  return client.startSession();
};
