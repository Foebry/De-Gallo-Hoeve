import { NextApiRequest, NextApiResponse } from 'next';
import { NotAllowedError } from 'src/shared/RequestError';
import { REQUEST_METHOD } from 'src/utils/axios';
import getDisabledDays, { Request } from './getDisabledDays';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === REQUEST_METHOD.GET) return getDisabledDays(req as Request, res);
    throw new NotAllowedError();
  } catch (e: any) {
    return res.status(e.code).send(e.response);
  }
};

export default handler;
