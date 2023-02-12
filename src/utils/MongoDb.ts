import { ObjectId } from 'mongodb';
import { getAllRassen, RAS } from 'src/controllers/rasController';
import { getHondenByKlantId } from 'src/controllers/HondController';
import Factory from '../services/Factory';
import { getAllKlanten, KLANT } from 'src/controllers/KlantController';
import { CONFIRM } from 'src/types/EntityTpes/ConfirmTypes';
import { CONTENT } from 'src/controllers/ContentController';
import { INSCHRIJVING } from 'src/controllers/InschrijvingController';
import { TRAINING } from 'src/controllers/TrainingController';
import { PriveTrainingCollection } from 'src/types/EntityTpes/TrainingType';
import { IsKlantCollection } from 'src/types/EntityTpes/KlantTypes';
import { KlantHond } from 'src/types/EntityTpes/HondTypes';
import { RasCollection } from 'src/types/EntityTpes/RasTypes';
import { ERRORLOG } from 'src/types/EntityTpes/ErrorLogTypes';
import { InschrijvingCollection } from 'src/types/EntityTpes/InschrijvingTypes';
import { getInschrijvingCollection, getTrainingCollection } from './db';

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

// export const getFreeTimeSlots = async () => {
//   const all = [
//     '10:00',
//     '11:00',
//     '12:00',
//     '13:00',
//     '14:00',
//     '15:00',
//     '16:00',
//     '17:00',
//   ].map((el) => ({ label: el, value: el }));
//   const collection = await getInschrijvingCollection();
//   const inschrijvingen = await collection
//     .find({ training: 'prive', datum: { $gt: new Date() } })
//     .toArray();

//   const timeSlots = inschrijvingen.reduce((prev, curr) => {
//     const [date, time] = curr.datum.toISOString().split('T');
//     const keys = Object.keys(prev);
//     if (keys.includes(date)) {
//       return {
//         ...prev,
//         [date]: prev[date].filter((el: Option) => el.label !== time.substring(0, 5)),
//       };
//     } else
//       return {
//         ...prev,
//         [date]: all.filter((el: Option) => el.label !== time.substring(0, 5)),
//       };
//   }, {} as any);
//   return {
//     ...timeSlots,
//     default: all,
//   };
// };

export const clearAllData = async () => {
  if (process.env.NODE_ENV === 'test') {
    await Factory.getController(CONFIRM).deleteAll();
    await Factory.getController(KLANT).deleteAll();
    await Factory.getController(CONTENT).deleteAll();
    await Factory.getController(INSCHRIJVING).deleteAll();
    await Factory.getController(RAS).deleteAll();
    await Factory.getController(TRAINING).deleteAll();
    await Factory.getController(ERRORLOG).deleteAll();
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
