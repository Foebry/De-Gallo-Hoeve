import { ObjectId } from 'mongodb';
import { HondCollection, NewHond } from '@/types/EntityTpes/HondTypes';

type FeedbackSetting = { trainingCount: number; triggered: boolean };
export type FeedbackConfiguration = FeedbackSetting[];

export interface IsNewKlant {
  email: string;
  password: string;
  vnaam: string;
  lnaam: string;
  gsm: string;
  straat: string;
  nr: number;
  bus?: string;
  gemeente: string;
  postcode: number;
  honden: NewHond[];
}

export interface IsKlantCollection extends Omit<IsNewKlant, 'honden'> {
  _id: ObjectId;
  roles: string;
  verified: boolean;
  honden: HondCollection[];
  inschrijvingen: ObjectId[];
  reservaties: ObjectId[];
  feedbackConfiguration: FeedbackConfiguration;
  created_at: Date;
  verified_at: Date | null;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface IsUpdateKlantBody {
  email: string;
  password: string;
  vnaam: string;
  lnaam: string;
  gsm: string;
  straat: string;
  nr: number;
  gemeente: string;
  postcode: number;
}

export interface IsRegisterBody extends IsNewKlant {
  csrf: string;
}

export const updateFeedbackConfigurationForKlant = (klant: IsKlantCollection): void => {
  const trainingCount = klant.inschrijvingen.length;
  const feedbackConfiguration = klant.feedbackConfiguration;
  const setting50 = feedbackConfiguration.find((setting) => setting.trainingCount === 50);
  const setting20 = feedbackConfiguration.find((setting) => setting.trainingCount === 20);
  const setting10 = feedbackConfiguration.find((setting) => setting.trainingCount === 10);
  const setting5 = feedbackConfiguration.find((setting) => setting.trainingCount === 5);
  const setting1 = feedbackConfiguration.find((setting) => setting.trainingCount === 1);
  if (trainingCount >= 100) feedbackConfiguration.every((setting) => (setting.triggered = true));
  else if (trainingCount >= 50)
    [setting50, setting20, setting10, setting5, setting1].forEach((setting) => (setting!.triggered = true));
  else if (trainingCount >= 20)
    [setting20, setting10, setting5, setting1].forEach((setting) => (setting!.triggered = true));
  else if (trainingCount >= 10) [setting10, setting5, setting1].forEach((setting) => (setting!.triggered = true));
  else if (trainingCount >= 5) [setting5, setting1].forEach((setting) => (setting!.triggered = true));
  else setting1!.triggered = true;
};

export const getNextTresholdAmount = (klant: IsKlantCollection): number => {
  const amount = klant.inschrijvingen.length;
  return amount >= 100 ? 100 : amount >= 50 ? 50 : amount >= 20 ? 20 : amount >= 10 ? 10 : amount >= 5 ? 5 : 1;
};
