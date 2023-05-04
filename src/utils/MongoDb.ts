import { getAllRassen, RAS } from 'src/controllers/rasController';
import Factory from '../services/Factory';
import { getAllKlanten, KLANT } from 'src/controllers/KlantController';
import { CONTENT } from 'src/controllers/ContentController';
import { INSCHRIJVING } from 'src/controllers/InschrijvingController';
import { TRAINING } from 'src/controllers/TrainingController';
import { PriveTrainingCollection } from 'src/types/EntityTpes/TrainingType';
import { KlantHond } from 'src/types/EntityTpes/HondTypes';
import { RasCollection } from 'src/types/EntityTpes/RasTypes';
import { InschrijvingCollection } from 'src/types/EntityTpes/InschrijvingTypes';
import { getTrainingCollection } from './db';
import { TRAININGDAY } from 'src/controllers/TrainingDayController';
import { deleteAll as deleteAllErrorLogs } from 'src/pages/api/logError/repo';
import { IsKlantCollection } from 'src/common/domain/klant';
import { deleteAll as deleteAllFeedback } from 'src/pages/api/feedback/repo';

export interface Option {
  value: string;
  label: string;
}

export const getIndexData = async () => {
  try {
    const trainingCollection = await getTrainingCollection();
    const trainingen = (await trainingCollection
      .find()
      .toArray()) as PriveTrainingCollection[];
    return {
      trainingen: trainingen.map((training) => {
        return {
          image: training.image,
          _id: training._id.toString(),
          price: training.prijsExcl,
        };
      }),
    };
  } catch (e: any) {
    console.error(e.message);
    return {
      intro: { subtitle: '', content: [] },
      diensten: { subtitle: '', content: [] },
      trainingen: [],
    };
  }
};

export const clearAllData = async () => {
  if (process.env.NODE_ENV === 'test') {
    await Factory.getController(KLANT).deleteAll();
    await Factory.getController(CONTENT).deleteAll();
    await Factory.getController(INSCHRIJVING).deleteAll();
    await Factory.getController(RAS).deleteAll();
    await Factory.getController(TRAINING).deleteAll();
    await deleteAllErrorLogs();
    await Factory.getController(TRAININGDAY).deleteAll();
    await deleteAllFeedback();
  }
};

export async function getData(controller: string): Promise<IsKlantCollection[]>;
export async function getData(controller: string): Promise<InschrijvingCollection[]>;
export async function getData(controller: string): Promise<KlantHond[]>;
export async function getData(controller: string): Promise<RasCollection[]>;
export async function getData(controller: string) {
  return controller === 'HondController'
    ? Factory.getController(controller).getAllHonden()
    : controller === 'InschrijvingController'
    ? Factory.getController(controller).getAllInschrijvingen()
    : controller === 'KlantController'
    ? getAllKlanten()
    : getAllRassen();
}

export type CollectionOptions = {
  includeDeleted: boolean;
};
