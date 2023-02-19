import { NextApiRequest } from 'next';
import { TRAININGDAY } from 'src/controllers/TrainingDayController';
import { getController } from 'src/services/Factory';
import { mapToAvailableTrainingDays } from './mappers';
import { ListResponse } from './schemas';

export const getAvailableDays = async (req: NextApiRequest, res: ListResponse) => {
  try {
    const data = await getController(TRAININGDAY).getEnabledTrainingDays();

    // const result = data.map((day) => day.date.toISOString().split('T')[0]);

    const result = mapToAvailableTrainingDays(data);

    return res.status(200).send(result);
  } catch (error: any) {
    return res.status(error.code).json(error.response);
  }
};
