import { ObjectId } from "mongodb";

export interface NewRas {
  naam: string;
  soort: string;
}

export interface RasCollection extends NewRas {
  _id: ObjectId;
  created_at: Date;
  updated_at: Date;
}

export interface UpdateRas {
  naam?: string;
  soort?: string;
}
