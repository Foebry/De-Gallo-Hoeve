import Entitybase from './Entitybase';

type VacationDuration = {
  startDate: Date;
  endDate: Date;
};

export default class Vacation extends Entitybase {
  startDate!: Date;
  endDate!: Date;
  notificationStartDate!: Date;

  static Create = (duration: VacationDuration, notificationStartDate: Date) => {
    const vacation = new Vacation();
    vacation.startDate = duration.startDate;
    vacation.endDate = duration.endDate;
    vacation.notificationStartDate = notificationStartDate;

    return vacation;
  };
}
