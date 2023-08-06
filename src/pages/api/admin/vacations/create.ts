import moment from 'moment';
import { NextApiRequest, NextApiResponse } from 'next';
import Vacation from 'src/common/domain/entities/Vacation';
import Factory from 'src/services/Factory';
import { validate } from 'src/services/Validator';
import { toLocalTime } from 'src/shared/functions';
import { VacationOverLappingError } from 'src/shared/RequestError';
import { getVacationsBetweenStartAndEndDate, saveVacation } from './repo';
import { VacationSchema } from './schemas';
import { validateVacationNotOverlapping } from './validators';

export interface Request extends NextApiRequest {
  body: {
    duration: {
      from: string;
      to: string;
    };
    notificationStartDate?: string;
  };
}

export const createVacation = async (req: Request, res: NextApiResponse) => {
  try {
    await validate({ req, res }, { schema: VacationSchema });
    const { duration, notificationStartDate } = req.body;

    const startDate = toLocalTime(moment(duration.from).format('YYYY-MM-DD HH:mm:ss'));
    const endDate = toLocalTime(moment(duration.to).format('YYYY-MM-DD HH:mm:ss'));

    const vacations = await getVacationsBetweenStartAndEndDate(startDate, endDate);
    if (vacations.length) throw new VacationOverLappingError();

    const vacation = Vacation.Create({ startDate, endDate }, notificationStartDate);

    await saveVacation(vacation);

    return res.status(201).send(vacation);
  } catch (e: any) {
    return res.status(e.code).send(e.response);
  }
};
