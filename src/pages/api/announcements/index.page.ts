import { NextApiRequest, NextApiResponse } from 'next';
import { NotAllowedError } from 'src/shared/RequestError';
import { logError } from '../logError/repo';
import { listAnnouncements } from './list';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') return listAnnouncements(req, res);
    throw new NotAllowedError();
  } catch (e: any) {
    await logError('/vacations', req, e);
    return res.status(e.code).send(e.response);
  }
};

export default handler;
