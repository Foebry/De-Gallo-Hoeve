import { RasCollection } from '@/types/EntityTpes/RasTypes';
import { WithId } from 'mongodb';
import { RasQuery } from 'src/context/app/RasContext';
import { getRasCollection } from 'src/utils/db';

export const getRassen = async (
  skip: number,
  take: number,
  query?: RasQuery
): Promise<[number, WithId<RasCollection>[]]> => {
  const collection = await getRasCollection();

  const refinementQuery: Record<string, Record<string, any>> = { deleted_at: { deleted_at: undefined } };
  if (query?.ids) refinementQuery.ids = { _id: { $in: query.ids } };
  if (query?.search) refinementQuery.search = { naam: { $regex: `${query.search}`, $options: 'i' } };

  const refinements = Object.values(refinementQuery);

  const count = await collection.countDocuments({ $and: refinements });
  const rassen = await collection.find({ $and: refinements }).skip(skip).limit(take).sort({ name: 1 }).toArray();

  return [count, rassen];
};
