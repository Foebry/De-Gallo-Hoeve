import { VacationDto } from 'src/common/api/dtos/VacationDto';
import Vacation from 'src/common/domain/entities/Vacation';
import { toReadableDate } from 'src/shared/functions';

export const mapVacationToDto = (vacation: Vacation): VacationDto => ({
  id: vacation._id.toString(),
  duration: {
    from: toReadableDate(vacation.startDate),
    to: toReadableDate(vacation.endDate),
  },
  notificationStartDate: toReadableDate(vacation.notificationStartDate),
  createdAt: toReadableDate(vacation.created_at),
  updatedAt: toReadableDate(vacation.updated_at),
});
