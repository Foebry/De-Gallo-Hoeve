import { VacationDto } from 'src/common/api/dtos/VacationDto';
import Vacation from 'src/common/domain/entities/Vacation';

export const mapVacationToDto = (vacation: Vacation): VacationDto => ({
  id: vacation._id.toString(),
  notificationStartDate: vacation.notificationStartDate.toISOString(),
  duration: {
    from: vacation.startDate.toISOString(),
    to: vacation.endDate.toISOString(),
  },
  createdAt: vacation.created_at.toISOString(),
  updatedAt: vacation.updated_at.toISOString(),
});
