import { ObjectId } from 'mongodb';
import Subscription from 'src/common/domain/entities/Subscription';
import { getCollection } from 'src/utils/db';

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

export const getSubscriptionsByServiceIdAndSelectedDates = async (
  serviceId: ObjectId,
  selectedDates: Date[]
): Promise<GroupedSubscription[]> => {
  const collection = await getCollection<Subscription>(Subscription.name);

  // get documents that match the following configuration
  const match_ServiceAndDates = {
    $match: {
      deleted_at: undefined,
      serviceId,
      items: {
        $elemMatch: {
          date: { $in: selectedDates },
        },
      },
    },
  };

  // flatten documents by items
  const unwind_items = {
    $unwind: {
      path: '$items',
    },
  };

  // flatten documents by timeSlots
  const unwind_timeSlots = {
    $unwind: {
      path: '$items.timeSlots',
    },
  };

  // group documents by timeSlot
  const group_byTimeSlot = {
    $group: {
      _id: '$items.timeSlots',
      items: {
        $push: {
          subscriptionId: '$_id',
          moment: '$items.timeSlots',
          customerId: '$customerId',
          hondIds: '$items.dogs',
          date: '$items.date',
        },
      },
    },
  };

  //
  const group_andMapToTimeSlots = {
    $group: {
      _id: '$items.date',
      ochtend: {
        $push: {
          $cond: [
            { $eq: ['ochtend', '$items.moment'] },
            {
              subscriptionId: '$items.subscriptionId',
              klantId: '$items.customerId',
              hondIds: { $arrayElemAt: ['$items.hondIds', 0] },
            },
            null,
          ],
        },
      },
      middag: {
        $push: {
          $cond: [
            { $eq: ['middag', '$items.moment'] },
            {
              subscriptionId: '$items.subscriptionId',
              klantId: '$items.customerId',
              hondIds: { $arrayElemAt: ['$items.hondIds', 0] },
            },
            null,
          ],
        },
      },
      avond: {
        $push: {
          $cond: [
            { $eq: ['avond', '$items.moment'] },
            {
              subscriptionId: '$items.subscriptionId',
              klantId: '$items.customerId',
              hondIds: { $arrayElemAt: ['$items.hondIds', 0] },
            },
            null,
          ],
        },
      },
    },
  };

  // filter null values
  const addFields_filterNulls = {
    $addFields: {
      date: '$_id',
      ochtend: {
        $filter: {
          input: '$ochtend',
          as: 'ochtend',
          cond: { $ne: ['$$ochtend', null] },
        },
      },
      middag: {
        $filter: {
          input: '$middag',
          as: 'middag',
          cond: { $ne: ['$$middag', null] },
        },
      },
      avond: {
        $filter: {
          input: '$avond',
          as: 'avond',
          cond: { $ne: ['$$avond', null] },
        },
      },
    },
  };

  const result = await collection
    .aggregate([
      match_ServiceAndDates,
      unwind_items,
      unwind_timeSlots,
      group_byTimeSlot,
      unwind_items,
      group_andMapToTimeSlots,
      addFields_filterNulls,
    ])
    .toArray();

  return result as GroupedSubscription[];
};
