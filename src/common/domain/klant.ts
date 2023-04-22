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
  verified_at?: Date;
  updated_at: Date;
  deleted_at?: Date;
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
