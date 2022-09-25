import { ObjectId } from "mongodb";

export type TrainingType = "prive" | "groep";
export type geslachtType = "Reu" | "Teef";
type HondSoort = "klein" | "middlegroot" | "groot";

export interface Content {
  _id: ObjectId;
  subtitle: string;
  content: string;
  default_content: string;
  image?: string;
}

export interface Geslacht {
  _id: ObjectId;
  naam: string;
}

export interface KlantReservatie {}

export interface Hond {
  _id?: ObjectId;
  geslacht: geslachtType;
  geboortedatum: Date;
  naam: string;
  ras: string;
}
export interface KlantInschrijving {
  datum: Date;
  training: TrainingType;
  hond: {
    _id: ObjectId;
    naam: string;
  };
}

export interface Klant {
  _id?: ObjectId;
  email: string;
  roles: string;
  password: string;
  vnaam: string;
  lnaam: string;
  gsm: string;
  straat: string;
  nr: number;
  gemeente: string;
  postcode: number;
  verified: boolean;
  honden: Hond[];
  inschrijvingen: ObjectId[];
  reservaties: ObjectId[];
}

export interface Ras {
  _id: ObjectId;
  naam: string;
  soort: HondSoort;
  avatar: string;
}

export interface GroepTraining {
  _id?: ObjectId;
  naam: string;
  prijs: number;
  max_inschrijvingen: number;
  inschrijvingen: Inschrijving[];
}

export interface PriveTraining {
  _id?: ObjectId;
  naam: string;
  prijs: number;
  inschrijvingen: Inschrijving[];
}

export interface Inschrijving {
  _id?: ObjectId;
  datum: Date;
  training: string;
  hond: {
    id: string;
    naam: string;
  };
  klant: {
    id: string;
    vnaam: string;
    lnaam: string;
  };
}

export interface Confirm {
  _id?: ObjectId;
  klant_id: ObjectId;
  code: string;
  created_at: Date;
}
