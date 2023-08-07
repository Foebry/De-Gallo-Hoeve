import { NextApiRequest, NextApiResponse } from 'next';
import { NotAllowedError } from 'src/shared/RequestError';
import { ByIdRequest, getVacationDetails } from './byId';
import { deleteVacation, ResourceIdRequest } from './delete';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') return getVacationDetails(req as ByIdRequest, res);
    if (req.method === 'DELETE') return deleteVacation(req as ResourceIdRequest, res);
    throw new NotAllowedError();
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

export default handler;
