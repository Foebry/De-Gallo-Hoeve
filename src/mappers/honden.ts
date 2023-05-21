import { IsKlantCollection } from 'src/types/EntityTpes/KlantTypes';
import { RasCollection } from 'src/types/EntityTpes/RasTypes';
import moment from 'moment';
import { HondDetailResponse } from 'src/pages/api/admin/honden/[slug].page';
import { PaginatedData, PaginatedResponse } from 'src/shared/RequestHelper';
import { Geslacht, HondCollection, KlantHond } from 'src/types/EntityTpes/HondTypes';
import { HondDto } from 'src/common/api/types/hond';

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
