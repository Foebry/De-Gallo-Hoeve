import { ObjectId } from 'mongodb';
import { IsKlantCollection } from '../klant';
import Entitybase from './Entitybase';
import Service from './Service';

export enum TimeFrame {
  MORNING = 'morning',
  NOON = 'noon',
  EVENING = 'evening',
}

export type TrainingData = {
  date: Date;
  dogId: ObjectId;
};

export type DogWalkingData = {
  date: Date;
  timeFrame: TimeFrame;
  dogs: ObjectId[];
};

export default class Subscription<T extends TrainingData | DogWalkingData> extends Entitybase {
  serviceId!: ObjectId;
  customerId!: ObjectId;
  data!: T;

  static Create<T extends TrainingData | DogWalkingData>(
    service: Service,
    customer: IsKlantCollection,
    data: T
  ): Subscription<T> {
    const subscription = new Subscription<T>();
    subscription.serviceId = service._id;
    subscription.customerId = customer._id;
    subscription.data = data;

    return subscription;
  }
}
