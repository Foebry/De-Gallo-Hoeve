import { HondCollection } from '@/types/EntityTpes/HondTypes';
import { InschrijvingCollection } from '@/types/EntityTpes/InschrijvingTypes';
import { HondDto } from 'src/common/api/types/hond';
import { InschrijvingDto } from 'src/common/api/types/inschrijving';
import { IsKlantCollection } from 'src/common/domain/klant';

export const mapToAuthResult = (
  honden: HondCollection[],
  inschrijvingen: InschrijvingCollection[],
  roles: string
): { loggedIn: boolean; roles: string; honden: Omit<HondDto, 'klant'>[]; inschrijvingen: InschrijvingDto[] } => ({
  loggedIn: true,
  roles,
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
});
