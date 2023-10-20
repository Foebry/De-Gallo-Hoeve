import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { SubscriptionDetailsDto, SubscriptionDto } from 'src/common/api/dtos/Subscription';
import Subscription from 'src/common/domain/entities/Subscription';
import { getHondenByKlantId } from 'src/controllers/HondController';
import { NotFoundError, NotFoundHttpErrorCodes } from 'src/shared/RequestError';
import { getKlantById } from '../auth/me/repo';
import { getServiceById } from '../services/repo';
import { mapSubscriptionDetailDtoToSubscriptionDetail, mapSubscriptionToSubscriptionDto } from './mappers';
import { saveSubcription } from './repo';

export interface Request extends NextApiRequest {
  body: {
    serviceId: string;
    klantId: string;
    items: SubscriptionDetailsDto[];
  };
}

export type Response = Partial<SubscriptionDto>;

const handler = async (req: Request, res: NextApiResponse<Response>) => {
  try {
    const { serviceId, items, klantId } = req.body;

    const service = await getServiceById(new ObjectId(serviceId));
    if (!service) throw new NotFoundError(`Service ${serviceId} not found`, NotFoundHttpErrorCodes.SERVICE_NOT_FOUND);

    const customer = await getKlantById(klantId);
    if (!customer) throw new NotFoundError(`Customer ${klantId} not found`, NotFoundHttpErrorCodes.CUSTOMER_NOT_FOUND);

    const dogs = await getHondenByKlantId(customer._id);
    const subscriptionDetails = items.map((item) => mapSubscriptionDetailDtoToSubscriptionDetail(item, dogs));

    const subscription = Subscription.Create(service, customer, subscriptionDetails);

    await saveSubcription(subscription);

    const result = mapSubscriptionToSubscriptionDto(subscription);

    return res.status(201).send(result);
  } catch (e: any) {
    console.log(e);
    return res.status(e.code).send(e.response);
  }
};

export default handler;
