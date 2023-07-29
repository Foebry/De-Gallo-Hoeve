import { NextApiRequest, NextApiResponse } from 'next';
import { NotAllowedError } from 'src/shared/RequestError';
import { ByIdRequest, getVacationDetails } from './byId';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') return getVacationDetails(req as ByIdRequest, res);
    throw new NotAllowedError();
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

export default handler;
