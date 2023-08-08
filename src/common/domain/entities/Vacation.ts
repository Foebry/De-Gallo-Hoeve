import moment from 'moment';
import { toLocalTime } from 'src/shared/functions';
import Entitybase from './Entitybase';

type VacationDuration = {
  startDate: Date;
  endDate: Date;
};

export default class Vacation extends Entitybase {
  startDate!: Date;
  endDate!: Date;
  notificationStartDate!: Date;

  setDefaultNotificationStartDate = () => {
    return toLocalTime(
      moment(this.startDate).subtract(14, 'days').format('YYYY-MM-DD HH:mm:ss')
    );
  };

  static Create = (duration: VacationDuration, notificationStartDate?: string) => {
    const vacation = new Vacation();
    vacation.startDate = duration.startDate;
    vacation.endDate = duration.endDate;
    vacation.notificationStartDate = notificationStartDate
      ? toLocalTime(moment(notificationStartDate).format('YYYY-MM-DD HH:mm:ss'))
      : vacation.setDefaultNotificationStartDate();

    return vacation;
  };
}
