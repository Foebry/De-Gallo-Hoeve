import { SelectedRange } from 'src/components/form/inputs/date/DateRangeSelector';
import { getDatesBetween } from 'src/shared/functions';
import { SelectedSubscriptionDay } from './checkAvailability';
import { getSubscriptionsByServiceIdAndSelectedDates } from './repo';

type AvailableAndBlockedSubscriptions = {
  availableSubscriptions: any[];
  blockedSubscriptions: any[];
};

export const getAvailableAndBlockedSubscriptions = async (
  serviceId: string,
  period: SelectedRange,
  selectedDays: SelectedSubscriptionDay[]
): Promise<AvailableAndBlockedSubscriptions> => {
  const availableSubscriptions: any[] = [];
  const blockedSubscriptions: any[] = [];
  const datesInPeriod = getDatesBetween(new Date(period.from), new Date(period.to));
  const selectedWeekDays = selectedDays.map((day) => parseInt(day.weekday));
  const selectedDates = datesInPeriod.filter((date) => selectedWeekDays.includes(date.getDay()));
  const optimisticSubscriptions = selectedDates.map((date) => ({
    ...selectedDays.find((day) => day.weekday === date.getDay().toString()),
    date,
  }));

  const existingSubscriptions = await getSubscriptionsByServiceIdAndSelectedDates(serviceId, selectedDates);

  optimisticSubscriptions.forEach((subscription) => {
    const existingSubscriptionsForDate = existingSubscriptions.filter((existingSub) =>
      existingSub.items.map((item) => item.date).includes(subscription.date)
    );
    if (!existingSubscriptionsForDate.length) availableSubscriptions.push(subscription);
    else if (existingSubscriptionsForDate) {
    }
  });

  return {
    availableSubscriptions,
    blockedSubscriptions,
  };
};
