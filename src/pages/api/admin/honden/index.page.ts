import { NextApiRequest, NextApiResponse } from 'next';
import { logError } from '../../logError/repo';
import listHonden, { ListRequest } from './list';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // adminApi({ req, res });

    if (req.method != 'GET') return res.status(405).send('Not Allowed');

    return listHonden(req as ListRequest, res);
  } catch (e: any) {
    await logError('honden', req, e);
    return res.status(e.code).send(e.message);
  }
};

export default handler;
