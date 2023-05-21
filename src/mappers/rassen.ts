import { ObjectId } from 'mongodb';
import { PaginatedData, PaginatedResponse } from 'src/shared/RequestHelper';

export interface Ras {
  _id: ObjectId;
  naam: string;
  soort: string;
}

export interface PaginatedRas {
  _id: string;
  naam: string;
  soort: string;
}
