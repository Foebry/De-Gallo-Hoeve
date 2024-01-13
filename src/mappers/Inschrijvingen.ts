import moment from 'moment';
import { IsInschrijvingBodyInschrijving } from 'src/types/requestTypes';

export interface PaginatedInschrijving {
  _id: string;
  created_at: string;
  datum: string;
  training: string;
  klant: {
    _id: string;
    naam: string;
  };
  hond: {
    _id: string;
    naam: string;
  };
}

export interface DetailInschrijvingResponse {
  _id: string;
  training: string;
  created_at: string;
  klant: {
    vnaam: string;
    lnaam: string;
  };
  hond: {
    naam: string;
    ras: string;
  };
}

export const mapInschrijvingen = (inschrijvingen: IsInschrijvingBodyInschrijving[], prijs: number) =>
  inschrijvingen
    .map((inschrijving, index) => ({
      [`moment${index}`]: moment(inschrijving.datum).toISOString().replace('T', ' ').split(':00.')[0],
      [`hond${index}`]: inschrijving.hond_naam,
      [`prijsExcl${index}`]: prijs,
      [`prijsIncl${index}`]: Math.round(prijs * 1.21).toFixed(2),
    }))
    .reduce((prev, curr) => ({ ...prev, ...curr }), {});
