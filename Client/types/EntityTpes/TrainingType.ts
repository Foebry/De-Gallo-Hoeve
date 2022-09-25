import { ObjectId } from "mongodb";

export type TrainingType = "prive" | "groep";

export interface PriveTrainingCollection {
  _id: ObjectId;
  naam: TrainingType;
  prijs: number;
  inschrijvingen: ObjectId[];
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
