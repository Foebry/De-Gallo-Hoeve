import { PaginatedData, PaginatedResponse } from "../../helpers/RequestHelper";
import { HondCollection } from "../../types/EntityTpes/HondTypes";
import { InschrijvingCollection } from "../../types/EntityTpes/InschrijvingTypes";

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
