import { NextApiRequest, NextApiResponse } from 'next';
import Vacation from 'src/common/domain/entities/Vacation';
import { getCurrentActiveVacation } from './repo';

export const activeVacation = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Vacation | null> => {
  const vacation = await getCurrentActiveVacation();
  return vacation;
};
