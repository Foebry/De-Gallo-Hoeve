import { ObjectId, Document } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { secureApi } from 'src/services/Authenticator';
import { NotFoundError, NotFoundHttpErrorCodes } from 'src/shared/RequestError';
import { getServiceById } from '../../services/repo';
import { getSubcriptionsForService } from '../repo';

export interface Request extends NextApiRequest {
  query: {
    id: string;
  };
}

type ResponseType = Document[];

const handler = async (req: Request, res: NextApiResponse<ResponseType>) => {
  // secureApi({ req, res });

  const { id: serviceId } = req.query;
  const service = await getServiceById(new ObjectId(serviceId));
  if (!service)
    throw new NotFoundError(`Service with id ${serviceId} not found`, NotFoundHttpErrorCodes.SERVICE_NOT_FOUND);

  const subscriptions = await getSubcriptionsForService(service);

  return res.status(200).send(subscriptions);
};

export default handler;
