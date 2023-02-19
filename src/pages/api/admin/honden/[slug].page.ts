import { getHondById } from 'src/controllers/HondController';
import { getHondOwner } from 'src/controllers/KlantController';
import { getRasByName } from 'src/controllers/rasController';
import { mapToHondDetailResponse } from 'src/mappers/honden';
import {
  HondNotFoundError,
  KlantNotFoundError,
  NotAllowedError,
  RasNotFoundError,
} from 'src/shared/RequestError';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { closeClient } from 'src/utils/db';
import { logError } from 'src/controllers/ErrorLogController';
import { adminApi } from 'src/services/Authenticator';

export interface HondDetailResponse {
  _id: string;
  naam: string;
  ras: {
    naam: string;
    _id: string;
  };
  geboortedatum: string;
  geslacht: string;
  eigenaar: {
    fullName: string;
    _id: string;
  };
}
interface HondDetailRequest extends NextApiRequest {
  query: Partial<{ slug: string }>;
}

const handler = async (req: HondDetailRequest, res: NextApiResponse) => {
  try {
    adminApi({ req, res });

    if (req.method !== 'GET') throw new NotAllowedError();

    return getHondDetail(req, res);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

const getHondDetail = async (
  req: HondDetailRequest,
  res: NextApiResponse<HondDetailResponse | { message: string }>
) => {
  try {
    const { slug: _id } = req.query;

    const hond = await getHondById(new ObjectId(_id));
    if (!hond) throw new HondNotFoundError();

    const klant = await getHondOwner(hond);
    if (!klant) throw new KlantNotFoundError();

    const ras = await getRasByName(hond.ras);
    if (!ras) throw new RasNotFoundError();

    const result = mapToHondDetailResponse(hond, klant, ras);

    return res.status(200).send(result);
  } catch (e: any) {
    await logError('honden/:id', req, e);
    return res.status(e.code).json(e.response);
  }
};

export default handler;
