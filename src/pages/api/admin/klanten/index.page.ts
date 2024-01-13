import { NextApiRequest, NextApiResponse } from 'next';
import { adminApi } from 'src/services/Authenticator';
import { NotAllowedError } from 'src/shared/RequestError';
import listKlanten, { ListRequest } from './list';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // adminApi({ req, res });

    if (req.method !== 'GET') throw new NotAllowedError();

    return listKlanten(req as ListRequest, res);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

export default handler;
