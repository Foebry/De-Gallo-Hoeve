import { NextApiRequest, NextApiResponse } from 'next';
import { adminApi } from 'src/services/Authenticator';
import { NotAllowedError } from 'src/shared/RequestError';
import { getAvailableDays } from './list';
import { EditRequest } from './schemas';
import { setAvailabelDays } from './update';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // adminApi({ req, res });

    if (req.method !== 'GET' && req.method !== 'PUT') throw new NotAllowedError();

    if (req.method === 'GET') return getAvailableDays(req, res);

    if (req.method === 'PUT') return setAvailabelDays(req as EditRequest, res);
  } catch (error: any) {
    return res.status(error.code).json(error.response);
  }
};

export default handler;
