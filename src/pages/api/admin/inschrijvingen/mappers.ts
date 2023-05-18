import { InschrijvingCollection } from '@/types/EntityTpes/InschrijvingTypes';
import { InschrijvingDto } from 'src/common/api/types/inschrijving';
import { PaginatedData, PaginatedResponse } from 'src/shared/RequestHelper';

export const mapToAdminInschrijvingenOverviewResult = (
  data: PaginatedData<InschrijvingCollection>
): PaginatedResponse<InschrijvingDto> => ({
  data: data.data.map((inschrijving) => ({
    id: inschrijving._id.toString(),
    created_at: inschrijving.created_at.toISOString().replace('T', ' ').split('.')[0],
    datum: inschrijving.datum.toISOString().replace('T', ' ').split('.')[0],
    training: inschrijving.training,
    klant: {
      id: inschrijving.klant.id.toString(),
      vnaam: inschrijving.klant.vnaam,
      lnaam: inschrijving.klant.lnaam,
    },
    hond: {
      id: inschrijving.hond.id.toString(),
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
