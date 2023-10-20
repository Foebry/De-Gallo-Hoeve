import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD } from 'src/utils/axios';
import { NotAllowedError } from 'src/shared/RequestError';
import checkAvailability, { Request } from './checkAvailability';
import { verifiedUserApi } from 'src/services/Authenticator';
import { validate } from 'src/services/Validator';
import { CheckAvailabilitySchema } from '../schemas';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    verifiedUserApi({ req, res });
    await validate({ req, res }, { schema: CheckAvailabilitySchema });

    if (req.method !== REQUEST_METHOD.POST) throw new NotAllowedError();

    return checkAvailability(req as Request, res);
  } catch (e: any) {
    return res.status(e.code).send(e.response);
  }
};

export default handler;
