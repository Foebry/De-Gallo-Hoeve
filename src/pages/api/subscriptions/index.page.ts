import { NextApiRequest, NextApiResponse } from 'next';
import { NotAllowedError } from 'src/shared/RequestError';
import { REQUEST_METHOD } from 'src/utils/axios';
import createSubscription from './create';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === REQUEST_METHOD.POST) return createSubscription(req, res);
    throw new NotAllowedError();
  } catch (e: any) {
    return res.status(e.code).send(e.response);
  }
};

export default handler;
