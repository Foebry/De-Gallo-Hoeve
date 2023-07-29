import { NextApiRequest, NextApiResponse } from 'next';
import Factory from 'src/services/Factory';
import { validate } from 'src/services/Validator';
import { VacationSchema } from './schemas';
import { validateVacationNotOverlapping } from './validators';

export interface Request extends NextApiRequest {
  body: {
    startDate: Date;
    endDate: Date;
    notificationStartDate: Date;
    longDescription?: string[];
    notificationDescription?: string;
  };
}

export const createVacation = async (req: Request, res: NextApiResponse) => {
  try {
    await validate({ req, res }, { schema: VacationSchema });
    const {
      startDate,
      endDate,
      notificationStartDate,
      longDescription,
      notificationDescription,
    } = req.body;

    validateVacationNotOverlapping(startDate, endDate);

    const vacation = Factory.createVacation(
      startDate,
      endDate,
      notificationStartDate,
      longDescription,
      notificationDescription
    );

    return res.status(201).send(vacation);
  } catch (e: any) {
    return res.status(e.code).send(e.response);
  }
};
