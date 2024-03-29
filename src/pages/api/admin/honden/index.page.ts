import { NextApiRequest, NextApiResponse } from 'next';
import { HOND } from 'src/controllers/HondController';
import {
  getPaginatedData,
  PaginatedRequestQuery,
  PaginatedResponse,
} from 'src/shared/RequestHelper';
import { mapToHondenOverviewResult, PaginatedKlantHond } from 'src/mappers/honden';
import { KlantHond } from 'src/types/EntityTpes/HondTypes';
import { adminApi } from 'src/services/Authenticator';
import { logError } from '../../logError/repo';

interface ListHondenRequest extends NextApiRequest {
  query: PaginatedRequestQuery;
  url: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // adminApi({ req, res });

    if (req.method != 'GET') return res.status(405).send('Not Allowed');

    return getHondenOverview(req as ListHondenRequest, res);
  } catch (e: any) {
    await logError('honden', req, e);
    return res.status(e.code).send(e.message);
  }
};

const getHondenOverview = async (
  req: ListHondenRequest,
  res: NextApiResponse<PaginatedResponse<PaginatedKlantHond>>
) => {
  try {
    const data = await getPaginatedData<KlantHond>(req.query, req.url, HOND);
    const result = mapToHondenOverviewResult(data);

    return res.status(200).send(result);
  } catch (e: any) {
    await logError('honden', req, e);
    return res.status(e.code).send(e.message);
  }
};

export default handler;
