import { SelectedRange } from 'src/components/form/inputs/date/DateRangeSelector';
import { BaseDto } from './BaseDto';

export type CreateVacationDto = {
  duration: SelectedRange;
  notificationStartDate: string;
};

export type VacationDto = BaseDto & CreateVacationDto;
