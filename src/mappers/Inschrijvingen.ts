import moment from "moment";
import { PaginatedData, PaginatedResponse } from "src/shared/RequestHelper";
import { HondCollection } from "src/types/EntityTpes/HondTypes";
import { InschrijvingCollection } from "src/types/EntityTpes/InschrijvingTypes";
import { IsInschrijvingBodyInschrijving } from "src/types/requestTypes";

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

export const mapToAdminInschrijvingenOverviewResult = (
  data: PaginatedData<InschrijvingCollection>
): PaginatedResponse<PaginatedInschrijving> => ({
  data: data.data.map((inschrijving) => ({
    _id: inschrijving._id.toString(),
    created_at: inschrijving.created_at
      .toISOString()
      .replace("T", " ")
      .split(".")[0],
    datum: inschrijving.datum.toISOString().replace("T", " ").split(".")[0],
    training: inschrijving.training,
    klant: {
      _id: inschrijving.klant.id.toString(),
      naam: inschrijving.klant.vnaam + " " + inschrijving.klant.lnaam,
    },
    hond: {
      _id: inschrijving.hond.id.toString(),
      naam: inschrijving.hond.naam,
    },
  })),
  pagination: {
    currentPage: data.pagination.currentPage,
    first: data.pagination.first + 1,
    last: data.pagination.last,
    next: data.pagination.next,
    previous: data.pagination.previous,
    total: data.pagination.total,
  },
});

export const mapToInschrijvingDetail = (
  inschrijving: InschrijvingCollection,
  hond: HondCollection
) => ({
  _id: inschrijving._id.toString(),
  datum: inschrijving.datum.toISOString().replace("T", " ").split(".")[0],
  training: inschrijving.training,
  created_at: inschrijving.created_at
    .toISOString()
    .replace("T", " ")
    .split(".")[0],
  klant: {
    _id: inschrijving.klant.id.toString(),
    vnaam: inschrijving.klant.vnaam,
    lnaam: inschrijving.klant.lnaam,
  },
  hond: {
    _id: inschrijving.hond.id.toString(),
    naam: inschrijving.hond.naam,
    ras: hond.ras,
  },
});

export const mapInschrijvingen = (
  inschrijvingen: IsInschrijvingBodyInschrijving[],
  isFirstInschrijving: boolean,
  prijs: number
) =>
  inschrijvingen
    .map((inschrijving, index) => ({
      [`moment${index}`]: moment(inschrijving.datum)
        .toISOString()
        .replace("T", " ")
        .split(":00.")[0],
      [`hond${index}`]: inschrijving.hond_naam,
      [`prijsExcl${index}`]:
        index === 0 && isFirstInschrijving ? "0.00" : prijs,
      [`prijsIncl${index}`]:
        index === 0 && isFirstInschrijving
          ? "0.00"
          : Math.round(prijs * 1.21).toFixed(2),
    }))
    .reduce((prev, curr) => ({ ...prev, ...curr }), {});
