import { VacationType } from '@/types/EntityTpes/VacationType';
import { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentActiveVacation } from './repo';

export const activeVacation = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<VacationType | null> => {
  const vacation = await getCurrentActiveVacation();
  return vacation;
};
