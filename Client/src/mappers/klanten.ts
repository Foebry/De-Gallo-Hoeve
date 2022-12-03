import { ObjectId } from "mongodb";
import { PaginatedData, PaginatedResponse } from "src/helpers/RequestHelper";
import { InschrijvingCollection } from "src/types/EntityTpes/InschrijvingTypes";
import { IsKlantCollection } from "src/types/EntityTpes/KlantTypes";

export const mapToAdminKlantenOverviewResult = (
  data: PaginatedData<IsKlantCollection>
): PaginatedResponse<PaginatedKlant> => {
  return {
    data: data.data.map((klant) => ({
      _id: klant._id,
      verified: klant.verified,
      email: klant.email,
      vnaam: klant.vnaam,
      lnaam: klant.lnaam,
      straat: klant.straat,
      nr: klant.nr.toString(),
      bus: klant.bus ?? undefined,
      postcode: klant.postcode.toString(),
      gemeente: klant.gemeente,
      created_at: klant.created_at
        .toISOString()
        .replace("T", " ")
        .split(".")[0],
      verified_at:
        klant.verified_at?.toISOString().replace("T", " ").split(".")[0] ??
        undefined,
    })),
    pagination: {
      currentPage: data.pagination.currentPage,
      first: data.pagination.first + 1,
      last: data.pagination.last,
      total: data.pagination.total,
      next: data.pagination.next,
      previous: data.pagination.previous,
    },
  };
};

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
  verified_at: klant.verified_at?.toISOString().replace("T", " ").split(".")[0],
  created_at: klant.created_at.toISOString().replace("T", " ").split(".")[0],
  inschrijvingen: inschrijvingen
    .map((inschrijving) => ({
      _id: inschrijving._id,
      datum: inschrijving.datum.toISOString().replace("T", " ").split(".")[0],
      training: inschrijving.training,
      hond: inschrijving.hond.naam,
    }))
    .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime()),
});

export interface PaginatedKlant {
  _id: ObjectId;
  verified: boolean;
  email: string;
  vnaam: string;
  lnaam: string;
  straat: string;
  nr: string;
  bus: string | undefined;
  postcode: string;
  gemeente: string;
  created_at: string;
  verified_at: string | undefined;
}

type Format = "DD-MM-YYYY hh:ii:ss" | "DD-MM-YYYY hh:ii:ss.mmm";

const formatDate = (date: Date, format: Format) => {
  return format === "DD-MM-YYYY hh:ii:ss"
    ? `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getUTCHours()}:${date.getMinutes()}:${date.getUTCSeconds()}`
    : "";
};
