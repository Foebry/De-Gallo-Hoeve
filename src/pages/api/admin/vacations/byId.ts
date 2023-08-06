import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { VacationNotFoundError } from 'src/shared/RequestError';
import { mapVacationToDto } from './mappers';
import { getVacationById } from './repo';

export interface ByIdRequest extends NextApiRequest {
  query: { _id: string };
}

export const getVacationDetails = async (req: ByIdRequest, res: NextApiResponse) => {
  try {
    const { _id } = req.query;
    const vacation = await getVacationById(new ObjectId(_id));
    if (!vacation) throw new VacationNotFoundError();

    const result = mapVacationToDto(vacation);
    return res.status(200).send(result);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};
