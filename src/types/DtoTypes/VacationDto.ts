import { BaseDtoType } from './BaseDto';

export type VacationDto = BaseDtoType & {
  duration: {
    startDate: string;
    endDate: string;
  };
  notificationStartDate: string;
  longDescription: string;
  notificationDescription: string;
};
