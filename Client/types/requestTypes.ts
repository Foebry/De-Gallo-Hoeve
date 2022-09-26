import { Geslacht } from "./EntityTpes/HondTypes";
import { TrainingType } from "./EntityTpes/TrainingType";

export interface IsLoginBody {
  email: string;
  password: string;
  csrf: string;
}
export interface IsNewKlantData {
  vnaam: string;
  lnaam: string;
  email: string;
  straat: string;
  nr: number;
  bus: string;
  gemeente: string;
  postcode: number;
  gsm: string;
  password: string;
  honden: {
    naam: string;
    geslacht: Geslacht;
    ras: string;
    geboortedatum: string;
  }[];
}

export interface IsRegisterBody extends IsNewKlantData {
  csrf: string;
}
export interface IsInschrijvingBody {
  csrf: string;
  klant_id: string;
  training: TrainingType;
  inschrijvingen: IsInschrijvingBodyInschrijving[];
}
export interface IsInschrijvingBodyInschrijving {
  datum: string;
  hond_id: string;
  hond_naam: string;
  hond_geslacht: Geslacht;
}
export interface IsUpdateInschrijvingBody {
  csrf: string;
  klant_id: string;
  training: TrainingType;
  datum: string;
  hond_id: string;
}

export interface IsConfirmQuery {
  code: string;
}

interface GetKlantenParams {}
interface GetHondenParams {}
interface GetInschrijvingenParams {}
interface GetRassenParams {}
