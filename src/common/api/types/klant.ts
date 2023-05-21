import { Geslacht } from '@/types/EntityTpes/HondTypes';
import { HondDto } from './hond';
import { InschrijvingDto } from './inschrijving';

export type KlantDto = {
  id: string;
  vnaam: string;
  lnaam: string;
  verified: boolean;
  created_at: string;
  straat: string;
  nr: string;
  bus?: string;
  gemeente: string;
  postcode: string;
  email: string;
  verified_at?: string;
  gsm: string;
  honden: {
    id: string;
    geslacht: Geslacht;
    naam: string;
    ras: string;
  }[];
  inschrijvingen: {
    id: string;
    datum: string;
    training: string;
    hond: string;
  }[];
};
