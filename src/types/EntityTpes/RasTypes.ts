import { ObjectId } from 'mongodb';

export interface NewRas {
  naam: string;
  soort: string;
}

export interface RasCollection extends NewRas {
  _id: ObjectId;
}

export interface UpdateRas {
  naam?: string;
  soort?: string;
}
