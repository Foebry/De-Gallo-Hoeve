import BaseEntity from 'src/entities/BaseEntity';

export type VacationType = BaseEntity & {
  startDate: Date;
  endDate: Date;
  notificationStartDate: Date;
  longDescription: string;
  notificationDescription: string;
};
