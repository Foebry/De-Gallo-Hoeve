import { ObjectId } from "mongodb";
import { HondCollection } from "./HondTypes";

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
  honden: HondCollection[];
}

export interface IsKlantCollection extends IsNewKlant {
  _id: ObjectId;
  roles: string;
  verified: boolean;
  inschrijvingen: ObjectId[];
  reservaties: ObjectId[];
  created_at: Date;
  verified_at?: Date;
  updated_at: Date;
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
