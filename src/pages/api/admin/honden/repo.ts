import { KlantHond } from '@/types/EntityTpes/HondTypes';
import { getKlantCollection } from 'src/utils/db';

export const getHonden = async (
  skip: number,
  take: number,
  query?: { ids?: string }
): Promise<[number, KlantHond[]]> => {
  const collection = await getKlantCollection();

  return [1, []];
};
