import Vacation from 'src/common/domain/entities/Vacation';
import { getVacationCollection } from 'src/utils/db';

export const getCurrentActiveVacation = async (): Promise<Vacation | null> => {
  const collection = await getVacationCollection();
  const today = new Date();
  return collection.findOne({
    deleted_at: undefined,
    notificationStartDate: { $lte: today },
    endDate: { $gte: today },
  });
};
