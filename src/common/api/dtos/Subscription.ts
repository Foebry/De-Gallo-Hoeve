import Subscription, { SubscriptionDetails, TimeFrame } from 'src/common/domain/entities/Subscription';

export type AvailabilityDto = {
  available?: SubscriptionDto;
  blocked?: SubscriptionDto;
  priceExcl: number;
  btw: number;
  totalExcl: number;
  totalIncl: number;
  travelTimes: number;
  travelCost: number;
  toBePayed: number;
};

export type SubscriptionDetailsDto = {
  datum: string;
  hondIds: string[];
  timeSlots: (string | TimeFrame)[];
  id: string;
};

export type SubscriptionDto = {
  serviceId: string;
  klantId: string;
  items: SubscriptionDetailsDto[];
};
