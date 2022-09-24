import { ObjectId } from "mongodb";

export type Geslacht = "Teef" | "Reu";

export interface HondCollection {
  _id: ObjectId;
  geslacht: Geslacht;
  geboortedatum: string;
  naam: string;
  ras: string;
  created_at: string;
  updated_at: string;
}

export interface NewHond {
  geslacht: Geslacht;
  geboortedatum: string;
  naam: string;
  ras: string;
}
