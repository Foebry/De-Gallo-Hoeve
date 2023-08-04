import { VacationDto } from '@/types/DtoTypes/VacationDto';
import { VacationType } from '@/types/EntityTpes/VacationType';
import { toReadableDate } from 'src/shared/functions';

export const mapVacationToDto = (vacation: VacationType): VacationDto => ({
  id: vacation._id.toString(),
  duration: {
    startDate: toReadableDate(vacation.duration.startDate),
    endDate: toReadableDate(vacation.duration.endDate),
  },
  notificationStartDate: toReadableDate(vacation.notificationStartDate),
  longDescription: vacation.longDescription.join('<br/>'),
  notificationDescription: vacation.notificationDescription,
  created_at: toReadableDate(vacation.created_at),
  updated_at: toReadableDate(vacation.updated_at),
});
