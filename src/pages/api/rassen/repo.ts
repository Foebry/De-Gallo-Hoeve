import { RasCollection } from '@/types/EntityTpes/RasTypes';
import { getRasCollection } from 'src/utils/db';

export const getAllRassen = async (): Promise<RasCollection[]> => {
  const collection = await getRasCollection();
  return collection.find({ deleted_at: undefined }).toArray();
};
