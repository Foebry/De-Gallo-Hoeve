import { HondCollection } from '@/types/EntityTpes/HondTypes';
import { InschrijvingCollection } from '@/types/EntityTpes/InschrijvingTypes';
import { InschrijvingDto } from 'src/common/api/types/inschrijving';

export const mapToInschrijvingDto = (inschrijving: InschrijvingCollection) => ({
  id: inschrijving._id.toString(),
  created_at: inschrijving.created_at.toISOString(),
  updated_at: inschrijving.updated_at.toISOString(),
  datum: inschrijving.datum.toISOString(),
  training: inschrijving.training,
  klant: {
    id: inschrijving.klant.id.toString(),
    vnaam: inschrijving.klant.vnaam,
    lnaam: inschrijving.klant.lnaam,
  },
  hond: {
    id: inschrijving.hond.id.toString(),
    naam: inschrijving.hond.naam,
    ras: '',
  },
});

export const mapToInschrijvingDetail = (
  inschrijving: InschrijvingCollection,
  hond: HondCollection
): InschrijvingDto => ({
  id: inschrijving._id.toString(),
  datum: inschrijving.datum.toISOString().replace('T', ' ').split('.')[0],
  training: inschrijving.training,
  created_at: inschrijving.created_at.toISOString().replace('T', ' ').split('.')[0],
  updated_at: inschrijving.updated_at.toISOString().replace('T', ' ').split('.')[0],
  klant: {
    id: inschrijving.klant.id.toString(),
    vnaam: inschrijving.klant.vnaam,
    lnaam: inschrijving.klant.lnaam,
  },
  hond: {
    id: inschrijving.hond.id.toString(),
    naam: inschrijving.hond.naam,
    ras: hond.ras,
  },
});
