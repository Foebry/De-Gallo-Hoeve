import BaseEntity from 'src/entities/BaseEntity';

export type VacationType = BaseEntity & {
  duration: {
    startDate: Date;
    endDate: Date;
  };
  notificationStartDate: Date;
  longDescription: string[];
  notificationDescription: string;
};

export const defaultVacationLongDescription: string[] = [
  `Beste klant, wij gaan er even tussen uit van %startDate% tot en met %endDate%.`,
  `Vanaf %resumeDate% staan wij weer volledig paraat voor u en uw trouwe vriend`,
];
export const defaultNotificationDescription: string = `Beste klant, wij gaan er even tussen uit vanaf %startDate%.`;
