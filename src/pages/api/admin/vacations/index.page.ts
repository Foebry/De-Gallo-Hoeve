import { NextApiRequest, NextApiResponse } from 'next';
import { NotAllowedError } from 'src/shared/RequestError';
import { createVacation } from './create';
import { getVacationsOverview, ListVacationRequest } from './list';
import { Request as CreateVacationRequest } from './create';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET')
      return getVacationsOverview(req as ListVacationRequest, res);
    if (req.method === 'POST') return createVacation(req as CreateVacationRequest, res);
    throw new NotAllowedError();
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

export default handler;
