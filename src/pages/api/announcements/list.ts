import { NextApiRequest, NextApiResponse } from 'next';
import { mapVacationToDto } from './mappers';
import { getCurrentActiveVacation } from './repo';

export const listAnnouncements = async (req: NextApiRequest, res: NextApiResponse) => {
  const vacation = await getCurrentActiveVacation();

  const result = vacation ? mapVacationToDto(vacation) : null;

  return res.status(200).send(result);
};
