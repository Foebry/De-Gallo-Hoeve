import { NextApiRequest, NextApiResponse } from 'next';
import { mapToRasDto } from './mappers';
import { getAllRassen } from './repo';
import { listResponse } from './schemas';

export const getRassen = async (
  req: NextApiRequest,
  res: NextApiResponse<listResponse>
) => {
  try {
    const rassen = await getAllRassen();
    const result = mapToRasDto(rassen);

    return res.status(200).send(result);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};
