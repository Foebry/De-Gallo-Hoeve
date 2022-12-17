import { IsKlantCollection } from "src/types/EntityTpes/KlantTypes";
import { RasCollection } from "src/types/EntityTpes/RasTypes";
import moment from "moment";
import { HondDetailResponse } from "src/pages/api/admin/honden/[slug].page";
import { PaginatedData, PaginatedResponse } from "src/shared/RequestHelper";
import {
  Geslacht,
  HondCollection,
  KlantHond,
} from "src/types/EntityTpes/HondTypes";

export type PaginatedKlantHond = {
  _id: string;
  naam: string;
  ras: string;
  geslacht: Geslacht;
  geboortedatum: string;
  created_at: string;
  updated_at: string;
  leeftijd: string;
  klant: {
    _id: string;
    naam: string;
  };
};

export const mapToHondenOverviewResult = (
  data: PaginatedData<KlantHond>
): PaginatedResponse<PaginatedKlantHond> => ({
  data: data.data.map((klantHond) => ({
    _id: klantHond._id.toString(),
    naam: klantHond.naam,
    ras: klantHond.ras,
    geslacht: klantHond.geslacht,
    geboortedatum: klantHond.geboortedatum
      .toISOString()
      .replace("T", " ")
      .split(".")[0],
    created_at: klantHond.created_at
      .toISOString()
      .replace("T", " ")
      .split(".")[0],
    updated_at: klantHond.updated_at
      .toISOString()
      .replace("T", " ")
      .split(".")[0],
    leeftijd: moment(klantHond.geboortedatum)
      .fromNow()
      .replace("years ago", "jaar")
      .replace("a month ago", "1 maand")
      .replace("days ago", "dagen"),
    klant: {
      _id: klantHond.klant._id.toString(),
      naam: klantHond.klant.naam,
    },
  })),
  pagination: {
    currentPage: data.pagination.currentPage,
    first: data.pagination.first + 1,
    last: data.pagination.last,
    total: data.pagination.total,
    next: data.pagination.next,
    previous: data.pagination.previous,
  },
});

export const mapToHondDetailResponse = (
  hond: HondCollection,
  klant: IsKlantCollection,
  ras: RasCollection
): HondDetailResponse => ({
  _id: hond._id.toString(),
  naam: hond.naam,
  geboortedatum: hond.geboortedatum.toISOString(),
  geslacht: hond.geslacht,
  eigenaar: {
    _id: klant._id.toString(),
    fullName: klant.vnaam + " " + klant.lnaam,
  },
  ras: {
    _id: ras._id.toString(),
    naam: ras.naam,
  },
});
