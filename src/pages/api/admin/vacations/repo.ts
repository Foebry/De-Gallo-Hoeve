import { ObjectId } from 'mongodb';
import Vacation from 'src/common/domain/entities/Vacation';
import { getVacationCollection } from 'src/utils/db';

export const getVacationsList = async (skip: number, take: number, query?: string) => {
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
      $and: [
        { deleted_at: undefined },
        {
          $or: [
            { startDate: { $lte: startDate }, endDate: { $gte: endDate } }, // complete overlap
            { startDate: { $gte: startDate }, endDate: { $lte: endDate } }, // complete encapsulation
          ],
        },
      ],
    })
    .toArray();
};

export const getCurrentActiveVacation = async (): Promise<Vacation | null> => {
  const collection = await getVacationCollection();
  const today = new Date();
  return collection.findOne({
    deleted_at: undefined,
    startDate: { $gte: today },
    endDate: { $lte: today },
  });
};

export const saveVacation = async (vacation: Vacation) => {
  const collection = await getVacationCollection();
  collection.insertOne(vacation);
};
