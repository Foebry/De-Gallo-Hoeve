import { ObjectId } from 'mongodb';
import { toReadableDate } from 'src/shared/functions';
import { PaginatedData, PaginatedResponse } from 'src/shared/RequestHelper';
import { InschrijvingCollection } from 'src/types/EntityTpes/InschrijvingTypes';
import { IsKlantCollection } from 'src/types/EntityTpes/KlantTypes';

export interface PaginatedKlant {
  _id: ObjectId;
  verified: boolean;
  email: string;
  vnaam: string;
  lnaam: string;
  straat: string;
  nr: string;
  bus: string | undefined;
  postcode: string;
  gemeente: string;
  created_at: string;
  verified_at: string | undefined;
}

type Format = 'DD-MM-YYYY hh:ii:ss' | 'DD-MM-YYYY hh:ii:ss.mmm';

const formatDate = (date: Date, format: Format) => {
  return format === 'DD-MM-YYYY hh:ii:ss'
    ? `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getUTCHours()}:${date.getMinutes()}:${date.getUTCSeconds()}`
    : '';
};
