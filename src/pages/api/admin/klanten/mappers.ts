import { InschrijvingCollection } from '@/types/EntityTpes/InschrijvingTypes';
import { IsKlantCollection } from 'src/common/domain/klant';
import { KlantDto } from 'src/common/api/types/klant';

export const mapToKlantDto = (klant: IsKlantCollection) => ({
  id: klant._id.toString(),
  verified: klant.verified,
  email: klant.email,
  vnaam: klant.vnaam,
  lnaam: klant.lnaam,
  straat: klant.straat,
  nr: klant.nr.toString(),
  bus: klant.bus ?? undefined,
  postcode: klant.postcode.toString(),
  gemeente: klant.gemeente,
  created_at: klant.created_at.toISOString(),
  verified_at: klant.verified_at ? klant.verified_at.toISOString() : undefined,
});

export const mapToKlantDetail = (klant: IsKlantCollection, inschrijvingen: InschrijvingCollection[]): KlantDto => ({
  id: klant._id.toString(),
  email: klant.email,
  vnaam: klant.vnaam,
  lnaam: klant.lnaam,
  gsm: klant.gsm,
  straat: klant.straat,
  nr: klant.nr.toString(),
  bus: klant.bus,
  gemeente: klant.gemeente,
  postcode: klant.postcode.toString(),
  honden: klant.honden.map((hond) => ({
    id: hond._id.toString(),
    geslacht: hond.geslacht,
    naam: hond.naam,
    ras: hond.ras,
  })),
  verified: klant.verified,
  verified_at: klant.verified_at?.toISOString().replace('T', ' ').split('.')[0],
  created_at: klant.created_at.toISOString().replace('T', ' ').split('.')[0],
  inschrijvingen: inschrijvingen
    .map((inschrijving) => ({
      id: inschrijving._id.toString(),
      datum: inschrijving.datum.toISOString().replace('T', ' ').split('.')[0],
      training: inschrijving.training,
      hond: inschrijving.hond.naam,
    }))
    .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime()),
});
