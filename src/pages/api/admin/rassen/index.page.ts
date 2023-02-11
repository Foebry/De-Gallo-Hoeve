import { NextApiRequest, NextApiResponse } from 'next';
import { RAS } from 'src/controllers/rasController';
import {
  getPaginatedData,
  PaginatedRequestQuery,
  PaginatedResponse,
} from 'src/shared/RequestHelper';
import { mapToRassenOverviewResult, PaginatedRas } from 'src/mappers/rassen';
import { GenericRequest } from 'src/pages/api/auth/login.page';
import { RasCollection } from 'src/types/EntityTpes/RasTypes';
import { adminApi } from 'src/services/Authenticator';
import { NotAllowedError } from 'src/shared/RequestError';

type RassenOverviewRequest = {
  query: PaginatedRequestQuery;
  url: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    adminApi({ req, res });

    if (req.method !== 'GET') throw new NotAllowedError();

    return getRassenOverview(req as GenericRequest<RassenOverviewRequest>, res);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

const getRassenOverview = async (
  req: GenericRequest<RassenOverviewRequest>,
  res: NextApiResponse<PaginatedResponse<PaginatedRas>>
) => {
  try {
    const data = await getPaginatedData<RasCollection>(req.query, req.url, RAS);

    const result = mapToRassenOverviewResult(data);

    return res.status(200).send(result);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

export default handler;
