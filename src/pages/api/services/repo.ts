import { ObjectId } from 'mongodb';
import { getCollection } from 'src/utils/db';
import Service from 'src/common/domain/entities/Service';

export const getServiceById = async (serviceId: ObjectId) => {
  const collection = await getCollection<Service>(Service.name);
  return collection.findOne({ $and: [{ _id: serviceId }] });
};
