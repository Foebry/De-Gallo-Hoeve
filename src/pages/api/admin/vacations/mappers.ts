import { VacationDto } from '@/types/DtoTypes/VacationDto';
import { VacationType } from '@/types/EntityTpes/VacationType';
import { toReadableDate } from 'src/shared/functions';

export const mapVacationToDto = (vacation: VacationType): VacationDto => ({
  id: vacation._id.toString(),
  endDate: toReadableDate(vacation.endDate),
  startDate: toReadableDate(vacation.startDate),
  notificationStartDate: toReadableDate(vacation.notificationStartDate),
  longDescription: vacation.longDescription,
  notificationDescription: vacation.notificationDescription,
});
