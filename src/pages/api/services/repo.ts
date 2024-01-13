import { Document, ObjectId } from 'mongodb';
import { getCollection } from 'src/utils/db';
import Service from 'src/common/domain/entities/Service';
import Subscription from 'src/common/domain/entities/Subscription';
import { getCurrentTime } from 'src/shared/functions';

export const getServiceById = async (serviceId: ObjectId) => {
  const collection = await getCollection<Service>(Service.name);
  return collection.findOne({ $and: [{ _id: serviceId }] });
};

export const addSubscriptionToService = async (subscription: Subscription) => {
  const { serviceId, _id: subscriptionId } = subscription;
  const collection = await getCollection<Service>(Service.name);
  return collection.updateOne(
    { _id: serviceId },
    { $addToSet: { subscriptions: subscriptionId }, $set: { updated_at: getCurrentTime() } }
  );
};
