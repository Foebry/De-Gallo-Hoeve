import { HondCollection, KlantHond } from '@/types/EntityTpes/HondTypes';
import { IsKlantCollection } from '@/types/EntityTpes/KlantTypes';
import { RasCollection } from '@/types/EntityTpes/RasTypes';
import moment from 'moment';
import { HondDto } from 'src/common/api/types/hond';
import { PaginatedData, PaginatedResponse } from 'src/shared/RequestHelper';

export const mapToHondenOverviewResult = (
  data: PaginatedData<KlantHond>
): PaginatedResponse<HondDto> => ({
  data: data.data.map((klantHond) => ({
    id: klantHond._id.toString(),
    naam: klantHond.naam,
    geslacht: klantHond.geslacht,
    created_at: klantHond.created_at.toISOString().replace('T', ' ').split('.')[0],
    updated_at: klantHond.updated_at.toISOString().replace('T', ' ').split('.')[0],
    ras: {
      id: klantHond.ras,
      naam: '',
    },
    klant: {
      id: klantHond.klant._id.toString(),
      vnaam: klantHond.klant.vnaam,
      lnaam: klantHond.klant.lnaam,
    },
    geboortedatum: klantHond.geboortedatum.toISOString().replace('T', ' ').split('.')[0],
    leeftijd: moment(klantHond.geboortedatum)
      .fromNow()
      .replace('years ago', 'jaar')
      .replace('a month ago', '1 maand')
      .replace('days ago', 'dagen'),
  })),
  pagination: {
    currentPage: data.pagination.currentPage,
    first: data.pagination.first + 1,
    last: data.pagination.last,
    total: data.pagination.total,
    next: data.pagination.next,
    previous: data.pagination.previous,
  },
});

export const mapToHondDetailResponse = (
  hond: HondCollection,
  klant: IsKlantCollection,
  ras: RasCollection
): HondDto => ({
  id: hond._id.toString(),
  naam: hond.naam,
  geslacht: hond.geslacht,
  created_at: hond.created_at.toISOString(),
  updated_at: hond.updated_at.toISOString(),
  geboortedatum: hond.geboortedatum.toISOString(),
  klant: {
    id: klant._id.toString(),
    vnaam: klant.vnaam,
    lnaam: klant.lnaam,
  },
  ras: {
    id: ras._id.toString(),
    naam: ras.naam,
  },
});
