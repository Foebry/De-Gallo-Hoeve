import { HondCollection, KlantHond } from '@/types/EntityTpes/HondTypes';
import { IsKlantCollection } from 'src/common/domain/klant';
import { RasCollection } from '@/types/EntityTpes/RasTypes';
import moment from 'moment';
import { HondDto } from 'src/common/api/types/hond';

export const mapToHondDto = (klantHond: KlantHond) => ({
  id: klantHond._id.toString(),
  naam: klantHond.naam,
  geslacht: klantHond.geslacht,
  created_at: klantHond.created_at.toISOString(),
  updated_at: klantHond.updated_at.toISOString(),
  ras: {
    id: '',
    naam: klantHond.ras,
  },
  klant: {
    id: klantHond.klant._id.toString(),
    vnaam: klantHond.klant.vnaam,
    lnaam: klantHond.klant.lnaam,
  },
  geboortedatum: klantHond.geboortedatum.toISOString(),
  leeftijd: moment(klantHond.geboortedatum)
    .fromNow()
    .replace('years ago', 'jaar')
    .replace('a month ago', '1 maand')
    .replace('days ago', 'dagen'),
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
