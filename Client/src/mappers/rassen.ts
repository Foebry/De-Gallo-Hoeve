import { ObjectId } from "mongodb";
import { PaginatedData, PaginatedResponse } from "src/helpers/RequestHelper";

export interface Ras {
  _id: ObjectId;
  naam: string;
  soort: string;
  //   created_at: Date;
  //   updated_at: Date;
}

export interface PaginatedRas {
  _id: string;
  naam: string;
  soort: string;
  //   created_at: string;
  //   updated_at: string;
}

export const mapToRassenOverviewResult = (
  data: PaginatedData<Ras>
): PaginatedResponse<PaginatedRas> => ({
  data: data.data.map((ras) => ({
    _id: ras._id.toString(),
    naam: ras.naam,
    soort: ras.soort,
    // created_at: ras.created_at.toISOString().replace("T", " ").split(".")[0],
    // updated_at: ras.updated_at.toISOString().replace("T", " ").split(".")[0],
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
