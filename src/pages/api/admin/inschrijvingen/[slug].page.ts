import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getHondById } from 'src/controllers/HondController';
import { getInschrijvingById } from 'src/controllers/InschrijvingController';
import {
  DetailInschrijvingResponse,
  mapToInschrijvingDetail,
} from 'src/mappers/Inschrijvingen';
import {
  HondNotFoundError,
  InschrijvingNotFoundError,
  NotAllowedError,
} from 'src/shared/RequestError';
import { logError } from 'src/controllers/ErrorLogController';
import { adminApi } from 'src/services/Authenticator';

export interface DetailRequest extends NextApiRequest {
  query: { slug: string };
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // adminApi({ req, res });

    if (req.method !== 'GET') throw new NotAllowedError();

    return getInschrijvingDetail(req as DetailRequest, res);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

const getInschrijvingDetail = async (
  req: DetailRequest,
  res: NextApiResponse<DetailInschrijvingResponse>
) => {
  const { slug: _id } = req.query;
  try {
    const inschrijving = await getInschrijvingById(new ObjectId(_id));
    if (!inschrijving) throw new InschrijvingNotFoundError();
    const hond = await getHondById(inschrijving.hond.id);
    if (!hond) throw new HondNotFoundError();

    const result = mapToInschrijvingDetail(inschrijving, hond);

    return res.status(200).send(result);
  } catch (e: any) {
    await logError('admin/inschrijvingen/:id', req, e);
    return res.status(e.code).send(e.response);
  }
};

export default handler;
