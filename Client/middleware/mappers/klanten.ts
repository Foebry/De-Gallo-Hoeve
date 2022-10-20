import { InschrijvingCollection } from "../../types/EntityTpes/InschrijvingTypes";
import { IsKlantCollection } from "../../types/EntityTpes/KlantTypes";

type PaginatedData<T> = {
  data: T[];
  pagination: {
    currentPage: number;
    first: number;
    last: number;
    next?: string;
    previous?: string;
    total: number;
  };
};

export const mapToAdminKlantenOverviewResult = (
  data: PaginatedData<IsKlantCollection>
) => ({
  klanten: data.data.map((klant) => ({
    _id: klant._id,
    verified: klant.verified,
    email: klant.email,
    vnaam: klant.vnaam,
    lnaam: klant.lnaam,
    straat: klant.straat,
    nr: klant.nr,
    bus: klant.bus,
    postcode: klant.postcode,
    gemeente: klant.gemeente,
    created_at: klant.created_at,
    verified_at: klant.verified_at,
  })),
  pagination: {
    page: data.pagination.currentPage,
    first: data.pagination.first + 1,
    last: data.pagination.last,
    total: data.pagination.total,
    next: data.pagination.next,
    previous: data.pagination.previous,
  },
});

export const mapToKlantDetail = (
  klant: IsKlantCollection,
  inschrijvingen: InschrijvingCollection[]
) => ({
  _id: klant._id.toString(),
  email: klant.email,
  vnaam: klant.vnaam,
  lnaam: klant.lnaam,
  gsm: klant.gsm,
  straat: klant.straat,
  nr: klant.nr,
  bus: klant.bus,
  gemeente: klant.gemeente,
  postcode: klant.postcode,
  honden: klant.honden.map((hond) => ({
    _id: hond._id.toString(),
    geslacht: hond.geslacht,
    naam: hond.naam,
    ras: hond.ras,
  })),
  roles: klant.roles,
  verified: klant.verified,
  verified_at:
    klant.verified_at &&
    formatDate(new Date(klant.verified_at), "DD-MM-YYYY hh:ii:ss"),
  created_at:
    klant.created_at &&
    formatDate(new Date(klant.created_at), "DD-MM-YYYY hh:ii:ss"),
  inschrijvingen: inschrijvingen
    .map((inschrijving) => ({
      _id: inschrijving._id,
      datum: inschrijving.datum.toISOString().replace("T", " ").split(".")[0],
      training: inschrijving.training,
      hond: inschrijving.hond.naam,
    }))
    .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime()),
});

type Format = "DD-MM-YYYY hh:ii:ss" | "DD-MM-YYYY hh:ii:ss.mmm";

const formatDate = (date: Date, format: Format) => {
  return format === "DD-MM-YYYY hh:ii:ss"
    ? `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getUTCHours()}:${date.getMinutes()}:${date.getUTCSeconds()}`
    : "";
};
