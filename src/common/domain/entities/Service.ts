import { ObjectId } from 'mongodb';
import Entitybase from './Entitybase';

export default class Service extends Entitybase {
  priceExcl!: number;
  content!: string;
  image!: string;
  name!: string;
  hasFreeTravel!: boolean;
  freeTravelRadius!: number;
  travelRate!: number;
  subscriptions!: ObjectId[];
  maxSubscriptionsPerTimeSlot!: number;

  static Create = (
    priceExcl: number,
    content: string,
    image: string,
    name: string,
    hasFreeTravel: boolean = false,
    freeTravelRadius: number = 0,
    travelRate: number = 0,
    maxSubscriptionsPerTimeSlot = 1
  ): Service => {
    const service = new Service();
    service.priceExcl = priceExcl;
    service.content = content;
    service.image = image;
    service.name = name;
    service.hasFreeTravel = hasFreeTravel;
    service.freeTravelRadius = freeTravelRadius;
    service.travelRate = travelRate;
    service.subscriptions = [];
    service.maxSubscriptionsPerTimeSlot = maxSubscriptionsPerTimeSlot;

    return service;
  };
}
