import { BaseDtoType } from './BaseDto';

export type VacationDto = BaseDtoType & {
  startDate: string;
  endDate: string;
  notificationStartDate: string;
  longDescription: string;
  notificationDescription: string;
};
