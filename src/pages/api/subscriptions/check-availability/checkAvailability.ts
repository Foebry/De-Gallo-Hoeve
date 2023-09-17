import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import Subscription from 'src/common/domain/entities/Subscription';
import { SelectedRange } from 'src/components/form/inputs/date/DateRangeSelector';
import { getHondenByKlantId } from 'src/controllers/HondController';
import { NotFoundError, NotFoundHttpErrorCodes } from 'src/shared/RequestError';
import { getKlantById } from '../../auth/me/repo';
import { getServiceById } from '../../services/repo';
import { getAvailableAndBlockedSubscriptions } from '../service';

export type SelectedSubscriptionDay = {
  weekday: string;
  dogs: string[];
  moments: string[];
};

export interface Request extends NextApiRequest {
  body: {
    serviceId: string;
    klantId: string;
    period: SelectedRange;
    selectedDays: SelectedSubscriptionDay[];
  };
}
export type Response = Partial<{
  available: Subscription;
  blocked: Subscription;
}>;

const handler = async (req: Request, res: NextApiResponse<Response>) => {
  try {
    const { serviceId, period, selectedDays, klantId } = req.body;

    const service = await getServiceById(new ObjectId(serviceId));
    if (!service) throw new NotFoundError(`Service ${serviceId} not found`, NotFoundHttpErrorCodes.SERVICE_NOT_FOUND);

    const customer = await getKlantById(klantId);
    if (!customer) throw new NotFoundError(`Customer ${klantId} not found`, NotFoundHttpErrorCodes.CUSTOMER_NOT_FOUND);

    const dogs = await getHondenByKlantId(customer._id);

    const { available, blocked } = await getAvailableAndBlockedSubscriptions(
      service,
      customer,
      dogs,
      period,
      selectedDays
    );

    return res.status(200).send({ available, blocked });
  } catch (e: any) {
    console.log(e);
    return res.status(e.code).send(e.response);
  }
};

export default handler;
