import { ObjectId } from 'mongodb';
import { BaseEntityType } from './BaseEntityType';

export type TrainingType = 'prive' | 'groep';

export interface PriveTrainingCollection {
  _id: ObjectId;
  naam: TrainingType;
  prijsExcl: number;
  gratisVerplaatsingBinnen: number;
  kmHeffing: number;
  inschrijvingen: ObjectId[];
  content: string;
  default_content: string[];
  bullets: string[];
  image: string;
  subtitle: string;
  updated_at: Date;
  created_at: Date;
  deleted_at?: Date;
}

// export interface TrainingDaysCollection {
//   _id: ObjectId;
//   date: Date;
// }

export type TrainingDaysCollection = BaseEntityType & {
  date: Date;
  timeslots: string[];
};

export interface GroepTrainingCollection extends PriveTrainingCollection {
  max_inschrijvingen: number;
}

export interface UpdateTraining {
  naam?: TrainingType;
  prijs?: number;
  inschrijvingen?: ObjectId[];
  max_inschrijvingen?: number;
}

export type TRAINING = 'TrainingController';
