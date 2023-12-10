import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { AvailabilityDto, SubscriptionDetailsDto } from 'src/common/api/dtos/Subscription';
import { getHondenByKlantId } from 'src/controllers/HondController';
import { NotFoundError, NotFoundHttpErrorCodes } from 'src/shared/RequestError';
import { getKlantById } from '../../auth/me/repo';
import { logError } from '../../logError/repo';
import { getServiceById } from '../../services/repo';
import { mapToAvailabilityDto } from '../mappers';
import { getAvailableAndBlockedSubscriptions, getBlockedSubscriptions } from '../repo';
import { getTravelCostForCustomer } from '../service';

export interface Request extends NextApiRequest {
  body: {
    serviceId: string;
    klantId: string;
    items?: SubscriptionDetailsDto[];
  };
}

export type Response = Partial<AvailabilityDto>;

const handler = async (req: Request, res: NextApiResponse<Response>) => {
  try {
    const { serviceId, items, klantId } = req.body;

    const service = await getServiceById(new ObjectId(serviceId));
    if (!service) throw new NotFoundError(`Service ${serviceId} not found`, NotFoundHttpErrorCodes.SERVICE_NOT_FOUND);

    const customer = await getKlantById(klantId);
    if (!customer) throw new NotFoundError(`Customer ${klantId} not found`, NotFoundHttpErrorCodes.CUSTOMER_NOT_FOUND);

    const dogs = await getHondenByKlantId(customer._id);

    const availableAndBlocked = items
      ? await getAvailableAndBlockedSubscriptions(service, customer, dogs, items)
      : await getBlockedSubscriptions(service, customer, dogs);

    const travelCost = await getTravelCostForCustomer(customer);
    const result = mapToAvailabilityDto(availableAndBlocked, service, travelCost);

    return res.status(200).send(result);
  } catch (err: any) {
    logError('/checkAvailability', req, err);
    return res.status(err.code).send(err.response);
  }
};

export default handler;
