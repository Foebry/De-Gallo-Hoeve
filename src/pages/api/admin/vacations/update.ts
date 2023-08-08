import moment from 'moment';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { SelectedRange } from 'src/components/form/inputs/date/DateRangeSelector';
import { validate } from 'src/services/Validator';
import { toLocalTime } from 'src/shared/functions';
import { VacationNotFoundError } from 'src/shared/RequestError';
import { getVacationById, update } from './repo';
import { VacationSchema } from './schemas';

export interface UpdateRequest extends NextApiRequest {
  query: {
    _id: string;
  };
  body: {
    duration: SelectedRange;
    notificationStartDate: string;
  };
}
export const updateVacation = async (req: UpdateRequest, res: NextApiResponse) => {
  try {
    await validate({ req, res }, { schema: VacationSchema });
    const { _id } = req.query;
    const {
      duration: { from: startDate, to: endDate },
      notificationStartDate,
    } = req.body;

    const vacation = await getVacationById(new ObjectId(_id));
    if (!vacation) throw new VacationNotFoundError();

    vacation.startDate = toLocalTime(moment(startDate).format('YYYY-MM-DD HH:mm:ss'));
    vacation.endDate = toLocalTime(moment(endDate).format('YYYY-MM-DD HH:mm:ss'));
    vacation.notificationStartDate = toLocalTime(
      moment(notificationStartDate).format('YYYY-MM-DD HH:mm:ss')
    );

    const updatedVacation = update(vacation);

    return res.status(200).send(updatedVacation);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};
