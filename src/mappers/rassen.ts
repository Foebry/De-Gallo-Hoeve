import { ObjectId } from 'mongodb';
import { PaginatedData, PaginatedResponse } from 'src/shared/RequestHelper';

export interface Ras {
  _id: ObjectId;
  naam: string;
  soort: string;
}

export interface PaginatedRas {
  _id: string;
  naam: string;
  soort: string;
}

export const mapToRassenOverviewResult = (
  data: PaginatedData<Ras>
): PaginatedResponse<PaginatedRas> => ({
  data: data.data.map((ras) => ({
    _id: ras._id.toString(),
    naam: ras.naam,
    soort: ras.soort,
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
