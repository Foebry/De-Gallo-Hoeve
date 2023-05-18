import { RasCollection } from '@/types/EntityTpes/RasTypes';
import { RasDto } from 'src/common/api/types/ras';
import { PaginatedData, PaginatedResponse } from 'src/shared/RequestHelper';

export const mapToRassenOverviewResult = (
  data: PaginatedData<RasCollection>
): PaginatedResponse<RasDto> => ({
  data: data.data.map((ras) => ({
    id: ras._id.toString(),
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
