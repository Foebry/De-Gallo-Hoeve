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

  return [1, []];
};
