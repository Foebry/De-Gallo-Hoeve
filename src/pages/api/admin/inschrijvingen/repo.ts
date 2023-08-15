import { InschrijvingCollection } from '@/types/EntityTpes/InschrijvingTypes';
import { WithId } from 'mongodb';
import { InschrijvingQuery } from 'src/context/app/InschrijvingContext';
import { getInschrijvingCollection } from 'src/utils/db';

export const getInschrijvingen = async (
  skip: number,
  take: number,
  query?: InschrijvingQuery
): Promise<[number, WithId<InschrijvingCollection>[]]> => {
  const collection = await getInschrijvingCollection();
  const refinementQuery: Record<string, any> = { deleted_at: { deleted_at: undefined } };
  if (query?.ids) refinementQuery.ids = { id: { $in: query.ids } };

  const refinements = Object.values(refinementQuery);

  const count = await collection.countDocuments({ deleted_at: undefined });
  const inschrijvingen = await collection
    .find(refinements ? { $and: [...refinements] } : {})
    .skip(skip)
    .limit(take)
    .toArray();

  return [count, inschrijvingen];
};
