import Entitybase from './Entitybase';

type VacationDuration = {
  startDate: Date;
  endDate: Date;
};

export default class Vacation extends Entitybase {
  startDate!: Date;
  endDate!: Date;
  notificationStartDate!: Date;
  bannerDescription!: string[];
  toastDescription!: string;

  constructor() {
    super();
  }

  getResumeDate = () => {
    return new Date(this.endDate.setDate(this.endDate.getDate() + 1));
  };

  getShortHandDate = (date: Date) => {};

  getBannerDescription = () => {
    const startDate = this.getShortHandDate(this.startDate);
    const endDate = this.getShortHandDate(this.endDate);
    const resumeDate = this.getShortHandDate(this.getResumeDate());

    return [
      `Beste klant, wij gaan er even tussen uit van ${startDate} tot en met ${endDate}.`,
      `Vanaf ${resumeDate} staan wij weer volledig paraat voor u en uw trouwe vriend`,
    ];
  };

  getToastDescription = () => {
    const endDate = this.getShortHandDate(this.endDate);
    return `'Beste klant, wij gaan er even tussen uit vanaf ${endDate}.`;
  };

  static Create = (duration: VacationDuration, notificationStartDate: Date) => {
    const vacation = new Vacation();
    vacation.startDate = duration.startDate;
    vacation.endDate = duration.endDate;
    vacation.notificationStartDate = notificationStartDate;
    vacation.bannerDescription = vacation.getBannerDescription();
    vacation.toastDescription = vacation.getToastDescription();
  };
}
