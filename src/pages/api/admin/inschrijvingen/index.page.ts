import { NextApiRequest, NextApiResponse } from 'next';
import { NotAllowedError } from 'src/shared/RequestError';
import ListInschrijvingen, { ListRequest } from './list';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // adminApi({ req, res });

    if (req.method !== 'GET') throw new NotAllowedError();

    return ListInschrijvingen(req as ListRequest, res);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

export default handler;
