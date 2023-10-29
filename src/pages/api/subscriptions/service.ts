import { HondCollection } from '@/types/EntityTpes/HondTypes';
import { ObjectId } from 'mongodb';
import { SubscriptionDetailsDto } from 'src/common/api/dtos/Subscription';
import Service from 'src/common/domain/entities/Service';
import Subscription, { SubscriptionDetails } from 'src/common/domain/entities/Subscription';
import { IsKlantCollection } from 'src/common/domain/klant';
import { notEmpty, unique } from 'src/shared/functions';
import { getSubscriptionsByServiceIdAndSelectedDates, GroupedSubscription, itemDetail } from './repo';

export type AvailableAndBlockedSubscriptions = Partial<{
  available: Subscription;
  blocked: Subscription;
}>;

export const getAvailableAndBlockedSubscriptions = async (
  service: Service,
  customer: IsKlantCollection,
  dogs: HondCollection[],
  items: SubscriptionDetailsDto[]
): Promise<AvailableAndBlockedSubscriptions> => {
  const dates = unique(items.map((item) => new Date(item.datum))).sort((a, b) => a.getTime() - b.getTime());
  const availableItems: SubscriptionDetails[] = [];
  const blockedItems: SubscriptionDetails[] = [];

  // get all existing subscriptions
  const existingSubscriptions = await getSubscriptionsByServiceIdAndSelectedDates(service._id, dates);

  const allItems = items.map((item) => ({
    date: new Date(item.datum),
    dogs: item.hondIds.map((id) => dogs.find((dog) => dog._id.toString() === id)).filter(notEmpty),
    timeSlots: item.timeSlots,
    id: new ObjectId(),
  }));

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

export const getTravelCostForCustomer = async (customer: IsKlantCollection): Promise<number> => {
  const address = `${customer.straat} ${customer.nr}${customer.bus} ${customer.gemeente} ${customer.postcode}`;
  return 14.99;
};
