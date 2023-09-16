import { NextApiRequest, NextApiResponse } from 'next';
import { SelectedRange } from 'src/components/form/inputs/date/DateRangeSelector';
import { mapToAvailableSubscriptionCheckResult } from './mappers';
import { getAvailableAndBlockedSubscriptions } from './service';

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
type Response = {};

const handler = async (req: Request, res: NextApiResponse<Response>) => {
  try {
    const { serviceId, period, selectedDays } = req.body;

    const { availableSubscriptions, blockedSubscriptions } = await getAvailableAndBlockedSubscriptions(
      serviceId,
      period,
      selectedDays
    );

    const result = mapToAvailableSubscriptionCheckResult(availableSubscriptions, blockedSubscriptions);

    return res.status(200).send(result);
  } catch (e: any) {
    console.log(e);
    return res.status(e.code).send(e.response);
  }
};

export default handler;
