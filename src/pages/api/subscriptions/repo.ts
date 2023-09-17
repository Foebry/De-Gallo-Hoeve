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

  // group documents by date
  const group_ByDate = {
    $group: {
      _id: { $arrayElemAt: ['$items.date', 0] },
      items: {
        $push: {
          subscriptionId: '$_id',
          moment: { $arrayElemAt: ['$items.timeSlots', 0] },
          customerId: '$customerId',
          hondIds: '$items.dogs',
        },
      },
    },
  };

  // flatten documents by items
  const unwind_Items = {
    $unwind: {
      path: '$items',
    },
  };

  // flatten documents by moment
  const unwind_items_moment = {
    $unwind: {
      path: '$items.moment',
    },
  };

  // group documents by date conditionally
  const group_ByMoment = {
    $group: {
      _id: '$_id',
      ochtend: {
        $push: {
          $cond: [
            { $eq: ['$items.moment', 'ochtend'] },
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
            { $eq: ['$items.moment', 'middag'] },
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
            { $eq: ['$items.moment', 'avond'] },
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
      group_ByDate,
      unwind_Items,
      unwind_items_moment,
      group_ByMoment,
      addFields_filterNulls,
    ])
    .toArray();

  return result as GroupedSubscription[];
};
