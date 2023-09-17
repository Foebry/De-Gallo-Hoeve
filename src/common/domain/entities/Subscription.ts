import { HondCollection } from '@/types/EntityTpes/HondTypes';
import { ObjectId } from 'mongodb';
import { IsKlantCollection } from '../klant';
import Entitybase from './Entitybase';
import Service from './Service';

export enum TimeFrame {
  MORNING = 'morning',
  NOON = 'noon',
  EVENING = 'evening',
}

export type SubscriptionDetails = {
  date: Date;
  dogs: HondCollection[];
  timeSlots: (string | TimeFrame)[];
};

export default class Subscription extends Entitybase {
  serviceId!: ObjectId;
  customerId!: ObjectId;
  items!: SubscriptionDetails[];

  static Create(service: Service, customer: IsKlantCollection, items: SubscriptionDetails[]): Subscription {
    const subscription = new Subscription();
    subscription.serviceId = service._id;
    subscription.customerId = customer._id;
    subscription.items = items;

    return subscription;
  }
}
