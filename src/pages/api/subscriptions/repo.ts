import { HondCollection, KlantHond } from '@/types/EntityTpes/HondTypes';
import { ObjectId, Document } from 'mongodb';
import { SubscriptionDetailsDto } from 'src/common/api/dtos/Subscription';
import Service from 'src/common/domain/entities/Service';
import Subscription, { SubscriptionDetails } from 'src/common/domain/entities/Subscription';
import { IsKlantCollection } from 'src/common/domain/klant';
import { getCurrentTime, notEmpty, unique } from 'src/shared/functions';
import { getCollection, match_excludeDeleted } from 'src/utils/db';
import { addSubscriptionToService } from '../services/repo';
import {
  addFields_filterNulls,
  fieldsToAdd,
  groupAndMapToTimeSlots,
  groupByTimeSlotItem,
  GroupByTimeSlotItem,
  group_andMapToTimeSlots,
  group_byTimeSlot,
  match_ServiceAndDates,
  unwind,
} from './aggregations';
import { AvailableAndBlockedSubscriptions, mapToAvailableAndBlocked } from './service';

export type itemDetail = {
  subscriptionId: ObjectId;
  klantId: ObjectId;
  hondIds: ObjectId[];
};

export type GroupedSubscription = {
  _id: Date;
  ochtend: itemDetail[];
  middag: itemDetail[];
  avond: itemDetail[];
  date: Date;
};

export const saveSubcription = async (subscription: Subscription) => {
  const collection = await getCollection<Subscription>(Subscription.name);
  return collection.insertOne(subscription);
};

export const getSubscriptionsByIds = async (ids: ObjectId[]) => {
  const collection = await getCollection<Subscription>(Subscription.name);
  return collection.find({ _id: { $in: ids } });
};

export const getAvailableAndBlockedSubscriptions = async (
  service: Service,
  customer: IsKlantCollection,
  dogs: HondCollection[],
  items: SubscriptionDetailsDto[]
): Promise<AvailableAndBlockedSubscriptions> => {
  const dates = unique(items.map((item) => new Date(item.datum))).sort((a, b) => a.getTime() - b.getTime());

  // get all existing subscriptions
  const existingSubscriptions = await getSubscriptionsByServiceIdAndSelectedDates(service._id, dates);

  const allItems: SubscriptionDetails[] = items.map((item) => ({
    date: new Date(item.datum),
    dogs: item.hondIds.map((id) => dogs.find((dog) => dog._id.toString() === id)).filter(notEmpty),
    timeSlots: item.timeSlots,
    id: new ObjectId(),
  }));
  return mapToAvailableAndBlocked(service, customer, allItems, existingSubscriptions);
};

export const getSubscriptionsByServiceIdAndSelectedDates = async (
  serviceId: ObjectId,
  selectedDates: Date[]
): Promise<GroupedSubscription[]> => {
  const collection = await getCollection<Subscription>(Subscription.name);

  const result = await collection
    .aggregate([
      match_ServiceAndDates(serviceId, selectedDates),
      unwind('$items'),
      unwind('$items.timeSlots'),
      group_byTimeSlot<GroupByTimeSlotItem>('$items.date', { items: { $push: groupByTimeSlotItem } }),
      unwind('$items'),
      group_andMapToTimeSlots('$items.date', groupAndMapToTimeSlots),
      addFields_filterNulls('date', '$_id', fieldsToAdd),
    ])
    .toArray();

  return result as GroupedSubscription[];
};

export const getBlockedSubscriptions = async (
  service: Service,
  customer: IsKlantCollection,
  dogs: HondCollection[]
) => {
  const collection = await getCollection<Subscription>(Subscription.name);

  const matchOptions = { serviceId: service._id, items: { $elemMatch: { date: { $gt: new Date() } } } };
  const subscriptions = (await collection.find(matchOptions).toArray()) as Subscription[];
  const items = subscriptions.map((sub) => sub.items).reduce((acc, curr) => [...acc, ...curr]);

  const blocked = (await collection
    .aggregate([
      match_excludeDeleted<Subscription>(matchOptions),
      unwind('$items'),
      unwind('$items.timeSlots'),
      group_byTimeSlot<GroupByTimeSlotItem>('$items.date', { items: { $push: groupByTimeSlotItem } }),
      unwind('$items'),
      group_andMapToTimeSlots('$items.date', { groupAndMapToTimeSlots }),
      addFields_filterNulls('date', '$_id', fieldsToAdd),
    ])
    .toArray()) as GroupedSubscription[];

  return mapToAvailableAndBlocked(service, customer, items, blocked);
};

export const handleSaveSubscription = async (subscription: Subscription) => {
  await saveSubcription(subscription);
  await addSubscriptionToCustomer(subscription);
  await addSubscriptionToService(subscription);
};

const addSubscriptionToCustomer = async (subscription: Subscription) => {
  const { customerId, _id } = subscription;
  const klantCollection = await getCollection<IsKlantCollection>('klant');
  return klantCollection.updateOne(
    { _id: customerId },
    { $addToSet: { subscriptions: _id }, $set: { updated_at: getCurrentTime() } }
  );
};

export const getSubcriptionsForService = async (service: Service): Promise<Document[]> => {
  const collection = await getCollection<Subscription>(Subscription.name);
  const maxSubscriptions = service.maxSubscriptionsPerTimeSlot;
  const dates = await collection
    .aggregate([
      {
        $match: {
          serviceId: new ObjectId('64e508a34a1ed9fa7ad6fe09'),
          deleted_at: null,
        },
      },
      { $unwind: '$items' },
      { $unwind: '$items.timeSlots' },
      {
        $group: {
          _id: {
            date: '$items.date',
            timeSlot: '$items.timeSlots',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.date',
          timeSlots: {
            $push: {
              k: '$_id.timeSlot',
              v: '$count',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          timeSlots: '$timeSlots',
        },
      },
      {
        $project: {
          date: 1,
          timeSlots: {
            $filter: {
              input: '$timeSlots',
              as: 'slot',
              cond: { $gte: ['$$slot.v', maxSubscriptions] },
            },
          },
        },
      },
      { $match: { timeSlots: { $ne: [] } } },
      {
        $project: {
          date: 1,
          timeSlots: { $arrayToObject: '$timeSlots' },
        },
      },
    ])
    .toArray();

  return dates;
};
