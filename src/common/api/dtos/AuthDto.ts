import { HondDto } from '../types/hond';
import { InschrijvingDto } from '../types/inschrijving';

export type AuthKlantDto = {
  id: string;
  vnaam: string;
  lnaam: string;
  roles: string;
};

export type AuthDto =
  | {
      loggedIn: false;
    }
  | { loggedIn: true; klant: AuthKlantDto & { honden: Omit<HondDto, 'klant'>[]; inschrijvingen: InschrijvingDto[] } };
