import { NextApiRequest, NextApiResponse } from 'next';
import { adminApi } from 'src/services/Authenticator';
import { NotAllowedError } from 'src/shared/RequestError';
import { ByIdRequest, getVacationDetails } from './byId';
import { deleteVacation, ResourceIdRequest } from './delete';
import { UpdateRequest, updateVacation } from './update';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    adminApi({ req, res });
    if (req.method === 'GET') return getVacationDetails(req as ByIdRequest, res);
    if (req.method === 'DELETE') return deleteVacation(req as ResourceIdRequest, res);
    if (req.method === 'PUT') return updateVacation(req as UpdateRequest, res);
    throw new NotAllowedError();
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

export default handler;
