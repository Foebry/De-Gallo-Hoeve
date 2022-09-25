import { ObjectId } from "mongodb";
import { Geslacht } from "./HondTypes";
import { TrainingType } from "./TrainingType";

export interface NewInschrijving {
  datum: string;
  training: TrainingType;
  hond: {
    id: ObjectId;
    naam: string;
  };
  klant: {
    id: ObjectId;
    vnaam: string;
    lnaam: string;
  };
}
export interface InschrijvingCollection extends NewInschrijving {
  _id: ObjectId;
  created_at: string;
  updated_at: string;
}

export interface IsInschrijving {
  datum: string;
  hond_id: string;
  hond_naam: string;
  hond_geslacht: Geslacht;
}
