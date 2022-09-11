import { ObjectId } from "mongodb";

export interface NewRas {
  naam: string;
  soort: string;
}

export interface RasCollection extends NewRas {
  _id: ObjectId;
  created_at: string;
  updated_at: string;
}

export interface UpdateRas {
  naam?: string;
  soort?: string;
}
