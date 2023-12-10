import { HondCollection } from '@/types/EntityTpes/HondTypes';
import { ObjectId } from 'mongodb';
import { SubscriptionDetailsDto, SubscriptionDto } from 'src/common/api/dtos/Subscription';
import Service from 'src/common/domain/entities/Service';
import Subscription, { SubscriptionDetails } from 'src/common/domain/entities/Subscription';
import { notEmpty } from 'src/shared/functions';
import { Response as AvailabilityResponse } from './check-availability/checkAvailability';

type AvailableAndBlocked = Partial<{ available: Subscription; blocked: Subscription }>;

export const mapToAvailabilityDto = (
  { available, blocked }: AvailableAndBlocked,
  service: Service,
  travelCost: number
): AvailabilityResponse => {
  const totalExcl = available?.items
    ? available.items.reduce((acc, curr) => {
        const rowPrice = curr.timeSlots.length === 1 ? service.priceExcl : curr.timeSlots.length === 2 ? 22.5 : 35;
        return acc + rowPrice * curr.dogs.length;
      }, 0)
    : 0;
  const btw = totalExcl * 0.21;
  const totalIncl = totalExcl + btw;
  const travelTimes = available?.items ? available.items.reduce((acc, item) => acc + item.timeSlots.length, 0) : 0;
  const toBePayed = totalIncl + travelCost * travelTimes;
  return {
    priceExcl: service.priceExcl,
    travelCost,
    available: available
      ? {
          items: available.items.map(mapSubscriptionDetailToSubscriptionDetailDto),
          klantId: available.customerId.toString(),
          serviceId: available.serviceId.toString(),
        }
      : undefined,
    blocked: blocked
      ? {
          items: blocked.items.map(mapSubscriptionDetailToSubscriptionDetailDto),
          klantId: blocked.customerId.toString(),
          serviceId: blocked.serviceId.toString(),
        }
      : undefined,
    totalExcl,
    btw,
    totalIncl,
    travelTimes,
    toBePayed,
  };
};

const mapSubscriptionDetailToSubscriptionDetailDto = (item: SubscriptionDetails): SubscriptionDetailsDto => {
  return {
    ...item,
    id: item.id.toString(),
    datum: item.date.toISOString(),
    hondIds: item.dogs.map((dog) => dog._id.toString()),
  };
};

export const mapSubscriptionDetailDtoToSubscriptionDetail = (
  item: SubscriptionDetailsDto,
  dogs: HondCollection[]
): SubscriptionDetails => {
  return {
    date: new Date(item.datum),
    id: new ObjectId(item.id),
    timeSlots: item.timeSlots,
    dogs: item.hondIds.map((hondId) => dogs.find((dog) => dog._id.toString() === hondId)).filter(notEmpty),
  };
};

export const mapSubscriptionToSubscriptionDto = (subscription: Subscription): SubscriptionDto => {
  return {
    klantId: subscription.customerId.toString(),
    serviceId: subscription.serviceId.toString(),
    items: subscription.items.map((item) => ({
      datum: item.date.toISOString(),
      hondIds: item.dogs.map((dog) => dog._id.toString()),
      id: item.id.toString(),
      timeSlots: item.timeSlots,
    })),
  };
};
