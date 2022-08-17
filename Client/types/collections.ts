import { ObjectId } from "mongodb";

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

type geslachtType = "Reu" | "Teef";

export interface KlantReservatie {}

export interface Hond {
  _id?: ObjectId;
  geslacht: geslachtType;
  geboortedatum: Date;
  naam: string;
  ras: string;
}
export interface KlantInschrijving {}

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
  inschrijvingen: KlantInschrijving[];
  reservaties: KlantReservatie[];
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
  inschrijvingen: {
    datum: Date;
    aantal: number;
    klanten: {
      _id: ObjectId;
      naam: string;
      hond: {
        _id: ObjectId;
        naam: string;
      };
    }[];
  }[];
}

export interface PriveTraining {
  _id?: ObjectId;
  naam: string;
  prijs: number;
  inschrijvingen: {
    datum: Date;
    klant: {
      _id: ObjectId;
      naam: string;
      hond: {
        _id: ObjectId;
        naam: string;
      };
    };
  }[];
}
