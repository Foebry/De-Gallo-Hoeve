import Subscription, { SubscriptionDetails, TimeFrame } from 'src/common/domain/entities/Subscription';

export type AvailabilityDto = {
  available?: Subscription;
  blocked?: Subscription;
  priceExcl: number;
  travelCost: number;
};

export type SubscriptionDetailsDto = {
  datum: string;
  hondIds: string[];
  timeSlots: (string | TimeFrame)[];
};

export type SubscriptionDto = {
  serviceId: string;
  klantId: string;
  items: SubscriptionDetailsDto[];
};
