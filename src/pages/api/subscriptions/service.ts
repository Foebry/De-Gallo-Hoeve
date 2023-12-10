import { ObjectId } from 'mongodb';
import Service from 'src/common/domain/entities/Service';
import Subscription, { SubscriptionDetails } from 'src/common/domain/entities/Subscription';
import { IsKlantCollection } from 'src/common/domain/klant';
import mailer, { TemplateIds } from 'src/utils/Mailer';
import { getServiceById } from '../services/repo';
import { GroupedSubscription, itemDetail } from './repo';

export type AvailableAndBlockedSubscriptions = Partial<{
  available: Subscription;
  blocked: Subscription;
}>;

export const mapToAvailableAndBlocked = (
  service: Service,
  customer: IsKlantCollection,
  subscriptionItems: SubscriptionDetails[],
  existingSubscriptions: GroupedSubscription[]
) => {
  const availableItems: SubscriptionDetails[] = [];
  const blockedItems: SubscriptionDetails[] = [];

  subscriptionItems.forEach((subscriptionItem) => {
    const { available: availableItem, blocked: blockedItem } = checkAvailability(
      service,
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
  service: Service,
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
    const timeSlotIsFull = timeslotRelevantSub && timeslotRelevantSub.length >= service.maxSubscriptionsPerTimeSlot;
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

export const sendSubscriptionEmails = async (subscription: Subscription) => {
  const templateForCustomer = TemplateIds.SUBSCRIPTION_CONFIRM;
  const templateForAdmin = TemplateIds.SUBSCRIPTION_HEADSUP;

  await mailer.sendMail(templateForCustomer, {});
  await mailer.sendMail(templateForAdmin, {});
};
