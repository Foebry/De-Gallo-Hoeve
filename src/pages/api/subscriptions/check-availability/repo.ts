import { ObjectId } from 'mongodb';
import Entitybase from 'src/common/domain/entities/Entitybase';
import Subscription from 'src/common/domain/entities/Subscription';
import { getCollection } from 'src/utils/db';

export const getSubscriptionsByServiceIdAndSelectedDates = async (serviceId: string, selectedDates: Date[]) => {
  const collection = await getCollection(Subscription);
  const result = await collection
    .find({
      $and: [
        { deleted_at: null },
        { serviceId: new ObjectId(serviceId) },
        {
          items: {
            $elemMatch: {
              dates: {
                $in: selectedDates,
              },
            },
          },
        },
      ],
    })
    .toArray();

  return result.map((item) => item.prototype);
};
