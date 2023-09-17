import { HondCollection } from '@/types/EntityTpes/HondTypes';
import { ObjectId } from 'mongodb';
import Service from 'src/common/domain/entities/Service';
import Subscription, { SubscriptionDetails } from 'src/common/domain/entities/Subscription';
import { IsKlantCollection } from 'src/common/domain/klant';
import { SelectedRange } from 'src/components/form/inputs/date/DateRangeSelector';
import { getDatesBetween, notEmpty } from 'src/shared/functions';
import { getServiceById } from '../services/repo';
import { SelectedSubscriptionDay } from './check-availability/checkAvailability';
import { getSubscriptionsByServiceIdAndSelectedDates, GroupedSubscription, itemDetail } from './repo';

export type AvailableAndBlockedSubscriptions = Partial<{
  available: Subscription;
  blocked: Subscription;
}>;

export const getAvailableAndBlockedSubscriptions = async (
  service: Service,
  customer: IsKlantCollection,
  dogs: HondCollection[],
  period: SelectedRange,
  selectedDays: SelectedSubscriptionDay[]
): Promise<AvailableAndBlockedSubscriptions> => {
  const datesInPeriod = getDatesBetween(new Date(period.from), new Date(period.to));
  const selectedWeekDays = selectedDays.map((day) => parseInt(day.weekday));
  const selectedDates = datesInPeriod.filter((date) => selectedWeekDays.includes(date.getDay()));

  const availableItems: SubscriptionDetails[] = [];
  const blockedItems: SubscriptionDetails[] = [];

  // get all existing subscriptions
  const existingSubscriptions = await getSubscriptionsByServiceIdAndSelectedDates(service._id, selectedDates);
  const allItems = createAllSubscriptionItems(selectedDays, selectedDates, dogs);

  allItems.forEach((subscriptionItem) => {
    const { available: availableItem, blocked: blockedItem } = checkAvailability(
      customer._id,
      subscriptionItem,
      existingSubscriptions
    );
    if (availableItem) availableItems.push(availableItem);
    else if (blockedItem) blockedItems.push(blockedItem);
  });

  // create new subscription with available items
  const subscriptionWithAvailableItems = availableItems.length
    ? Subscription.Create(service, customer, availableItems)
    : undefined;

  // create new subscription and map unavailable items
  const subscriptionWithBlockedItems = blockedItems.length
    ? Subscription.Create(service, customer, blockedItems)
    : undefined;

  return {
    available: subscriptionWithAvailableItems,
    blocked: subscriptionWithBlockedItems,
  };
};

const createAllSubscriptionItems = (
  weekdays: SelectedSubscriptionDay[],
  selectedDates: Date[],
  klantHonden: HondCollection[]
): SubscriptionDetails[] => {
  return selectedDates
    .map((date) => {
      const weekday = weekdays.find((wd) => wd.weekday === date.getDay().toString());
      if (!weekday) return null;
      const dogs = weekday.dogs.map((id) => klantHonden.find((kh) => kh._id.toString() === id)).filter(notEmpty);
      const timeSlots = weekday.moments;
      return {
        date,
        dogs,
        timeSlots,
      };
    })
    .filter(notEmpty);
};

const checkAvailability = (
  klantId: ObjectId,
  subscriptionItem: SubscriptionDetails,
  existingSubscriptions: GroupedSubscription[]
): { available?: SubscriptionDetails; blocked?: SubscriptionDetails & { reason: string } } => {
  let available: (SubscriptionDetails & { _id: ObjectId }) | undefined = undefined;
  let blocked: (SubscriptionDetails & { reason: string; _id: ObjectId }) | undefined = undefined;

  const relevantGroupedSubscription = existingSubscriptions.find(
    (sub) => sub.date.toISOString() === subscriptionItem.date.toISOString()
  );

  if (!relevantGroupedSubscription) return { available: subscriptionItem };

  // loop over each timeslot of current subscriptionItem
  subscriptionItem.timeSlots.forEach((timeSlot) => {
    const timeslotRelevantSub = relevantGroupedSubscription[
      timeSlot as keyof typeof relevantGroupedSubscription
    ] as unknown as itemDetail[];
    let status: ('full' | 'double') | true = true;

    // same timeSlot can be booked a maximum of 3 times;
    // timeSlots can not be booked twice by same user;
    const timeSlotIsFull = timeslotRelevantSub && timeslotRelevantSub.length >= 3;
    const custmerAlreadyBookedTimeSlot =
      timeslotRelevantSub && timeslotRelevantSub.find((ts) => ts.klantId.toString() === klantId.toString());

    if (timeSlotIsFull) status = 'full';
    else if (custmerAlreadyBookedTimeSlot) status = 'double';

    // if not available add to blocked
    // else add to available
    switch (status) {
      case 'full':
      case 'double':
        if (blocked) {
          blocked.timeSlots.push(timeSlot);
          blocked.reason = status;
        } else blocked = { ...subscriptionItem, timeSlots: [timeSlot], reason: status, _id: new ObjectId() };
        break;
      default:
        if (available) available.timeSlots.push(timeSlot);
        else available = { ...subscriptionItem, timeSlots: [timeSlot], _id: new ObjectId() };
    }
  });

  return {
    available,
    blocked,
  };
};
