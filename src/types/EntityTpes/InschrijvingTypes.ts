import { ObjectId } from "mongodb";
import { Geslacht } from "./HondTypes";
import { TrainingType } from "./TrainingType";

export interface BaseInschrijving {
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

export interface NewInschrijving extends BaseInschrijving {
  datum: string;
}
export interface InschrijvingCollection extends BaseInschrijving {
  datum: Date;
  _id: ObjectId;
  created_at: Date;
  updated_at: Date;
}

export interface IsInschrijving {
  datum: Date;
  hond_id: string;
  hond_naam: string;
  hond_geslacht: Geslacht;
}
