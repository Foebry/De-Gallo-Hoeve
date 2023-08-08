import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { VacationNotFoundError } from 'src/shared/RequestError';
import { getVacationById, hardDeleteVacation } from './repo';

export interface ResourceIdRequest extends NextApiRequest {
  query: { _id: string };
}

export const deleteVacation = async (req: ResourceIdRequest, res: NextApiResponse) => {
  try {
    const { _id } = req.query;
    const vacation = await getVacationById(new ObjectId(_id));
    if (!vacation) throw new VacationNotFoundError();

    await hardDeleteVacation(vacation);
    return res.status(204).send(null);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};
