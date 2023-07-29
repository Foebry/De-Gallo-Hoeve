import { NextApiRequest, NextApiResponse } from 'next';
import { NotAllowedError } from 'src/shared/RequestError';
import { activeVacation } from '../activeVacation';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') return activeVacation(req, res);
    throw new NotAllowedError();
  } catch (e: any) {
    return res.status(e.code).send(e.response);
  }
};

export default handler;
