import { HondCollection } from '@/types/EntityTpes/HondTypes';
import { InschrijvingCollection } from '@/types/EntityTpes/InschrijvingTypes';
import { AuthDto } from 'src/common/api/dtos/AuthDto';
import { HondDto } from 'src/common/api/types/hond';
import { InschrijvingDto } from 'src/common/api/types/inschrijving';
import { IsKlantCollection } from 'src/common/domain/klant';

export const mapToAuthResult = (
  klant: IsKlantCollection,
  honden: HondCollection[],
  inschrijvingen: InschrijvingCollection[]
): AuthDto => ({
  loggedIn: true,
  klant: {
    id: klant._id.toString(),
    vnaam: klant.vnaam,
    lnaam: klant.lnaam,
    roles: klant.roles,
    honden: honden.map((hond) => ({
      ...hond,
      id: hond._id.toString(),
      geboortedatum: hond.geboortedatum.toISOString(),
      created_at: hond.created_at.toISOString(),
      updated_at: hond.updated_at.toISOString(),
      deleted_at: hond.deleted_at?.toISOString(),
      ras: {
        id: hond.ras,
        naam: hond.ras,
      },
    })),
    inschrijvingen: inschrijvingen.map((inschrijving) => ({
      ...inschrijving,
      id: inschrijving._id.toString(),
      datum: inschrijving.datum.toISOString(),
      created_at: inschrijving.created_at.toISOString(),
      updated_at: inschrijving.updated_at.toISOString(),
      deleted_at: inschrijving.deleted_at?.toISOString(),
      klant: {
        ...inschrijving.klant,
        id: inschrijving.klant.id.toString(),
      },
      hond: {
        ...inschrijving.hond,
        id: inschrijving.hond.id.toString(),
        ras: inschrijving.hond.naam,
      },
    })),
  },
});
