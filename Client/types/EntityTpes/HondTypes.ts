import { ObjectId } from "mongodb";

export type Geslacht = "Teef" | "Reu";

export interface HondCollection {
  _id: ObjectId;
  geslacht: Geslacht;
  geboortedatum: Date;
  naam: string;
  ras: string;
  created_at: Date;
  updated_at: Date;
}

export interface NewHond {
  geslacht: Geslacht;
  geboortedatum: string;
  naam: string;
  ras: string;
}
