import { ObjectId } from 'mongodb';

export type GroupByTimeSlotItem = {
  subscriptionId: string;
  moment: string;
  customerId: string;
  hondIds: string;
  date: string;
};

export const groupByTimeSlotItem: GroupByTimeSlotItem = {
  subscriptionId: '$_id',
  moment: '$items.timeSlots',
  customerId: '$customerId',
  hondIds: '$items.dogs',
  date: '$items.date',
};

export const groupAndMapToTimeSlots = {
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
};

export const fieldsToAdd = {
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
};

// get documents that match the following configuration
export const match_ServiceAndDates = (serviceId: ObjectId, selectedDates: Date[]) => ({
  $match: {
    deleted_at: undefined,
    serviceId,
    items: {
      $elemMatch: {
        date: { $in: selectedDates },
      },
    },
  },
});

// flatten documents by items
export const unwind = (path: string) => ({
  $unwind: { path },
});

// flatten documents by timeSlots
const unwind_timeSlots = {
  $unwind: {
    path: '$items.timeSlots',
  },
};

// group documents by timeSlot
export const group_byTimeSlot = <T>(
  groupId: string,
  groupItems: Record<string, { $push: Record<keyof T, string> }>
) => ({
  $group: {
    _id: groupId,
    ...groupItems,
  },
});

//
export const group_andMapToTimeSlots = (groupId: string, groupItems: Record<string, any>) => ({
  $group: {
    _id: groupId,
    ...groupItems,
  },
});

// filter null values
export const addFields_filterNulls = (id: string, idRef: string, addedFields: any) => ({
  $addFields: {
    [id]: idRef,
    ...addedFields,
  },
});
