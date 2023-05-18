import { IsKlantCollection } from 'src/types/EntityTpes/KlantTypes';
import { RasCollection } from 'src/types/EntityTpes/RasTypes';
import moment from 'moment';
import { HondDetailResponse } from 'src/pages/api/admin/honden/[slug].page';
import { PaginatedData, PaginatedResponse } from 'src/shared/RequestHelper';
import { Geslacht, HondCollection, KlantHond } from 'src/types/EntityTpes/HondTypes';

export type PaginatedKlantHond = {
  _id: string;
  naam: string;
  ras: string;
  geslacht: Geslacht;
  geboortedatum: string;
  created_at: string;
  updated_at: string;
  leeftijd: string;
  klant: {
    _id: string;
    naam: string;
  };
};

export const mapToHondDetailResponse = (
  hond: HondCollection,
  klant: IsKlantCollection,
  ras: RasCollection
): HondDetailResponse => ({
  _id: hond._id.toString(),
  naam: hond.naam,
  geboortedatum: hond.geboortedatum.toISOString(),
  geslacht: hond.geslacht,
  eigenaar: {
    _id: klant._id.toString(),
    fullName: klant.vnaam + ' ' + klant.lnaam,
  },
  ras: {
    _id: ras._id.toString(),
    naam: ras.naam,
  },
});
