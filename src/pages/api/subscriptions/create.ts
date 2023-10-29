import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { SubscriptionDetailsDto, SubscriptionDto } from 'src/common/api/dtos/Subscription';
import Subscription from 'src/common/domain/entities/Subscription';
import { getHondenByKlantId } from 'src/controllers/HondController';
import { secureApi } from 'src/services/Authenticator';
import { validate } from 'src/services/Validator';
import { NotFoundError, NotFoundHttpErrorCodes } from 'src/shared/RequestError';
import { getKlantById } from '../auth/me/repo';
import { logError } from '../logError/repo';
import { getServiceById } from '../services/repo';
import { mapSubscriptionDetailDtoToSubscriptionDetail, mapSubscriptionToSubscriptionDto } from './mappers';
import { saveSubcription } from './repo';
import { CreateSubscriptionSchema } from './schemas';

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
    secureApi({ req, res });
    await validate({ req, res }, { schema: CreateSubscriptionSchema });

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
  } catch (err: any) {
    logError('/subscriptions', req, err);
    return res.status(err.code).send(err.response);
  }
};

export default handler;
