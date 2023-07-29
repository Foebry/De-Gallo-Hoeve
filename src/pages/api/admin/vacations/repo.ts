import { VacationType } from '@/types/EntityTpes/VacationType';
import { ObjectId } from 'mongodb';
import { getVacationCollection } from 'src/utils/db';

export const getVacationsList = async (take: number, skip: number, query?: string) => {
  const collection = await getVacationCollection();
  return collection.find({}, { skip, batchSize: take }).toArray();
};

export const getVacationById = async (_id: ObjectId) => {
  const collection = await getVacationCollection();
  return collection.findOne({ _id });
};

export const getVacationsBetweenStartAndEndDate = async (
  startDate: Date,
  endDate: Date
) => {
  const collection = await getVacationCollection();
  return collection
    .find({
      deleted_at: undefined,
      startDate: { $lt: endDate, $gt: startDate },
      endDate: { $lt: endDate, $gt: startDate },
    })
    .toArray();
};

export const getCurrentActiveVacation = async (): Promise<VacationType | null> => {
  const collection = await getVacationCollection();
  const today = new Date();
  return collection.findOne({
    deleted_at: undefined,
    startDate: { $gte: today },
    endDate: { $lte: today },
  });
};
