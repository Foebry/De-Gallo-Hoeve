import { ObjectId } from "mongodb";

export type TrainingType = "prive" | "groep";

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
}

export interface TrainingDaysCollection {
  _id: ObjectId;
  date: Date;
}

export interface GroepTrainingCollection extends PriveTrainingCollection {
  max_inschrijvingen: number;
}

export interface UpdateTraining {
  naam?: TrainingType;
  prijs?: number;
  inschrijvingen?: ObjectId[];
  max_inschrijvingen?: number;
}

export type TRAINING = "TrainingController";
