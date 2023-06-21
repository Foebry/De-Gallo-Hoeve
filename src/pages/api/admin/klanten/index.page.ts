import { NextApiRequest, NextApiResponse } from 'next';
import { KLANT } from 'src/controllers/KlantController';
import {
  getPaginatedData,
  PaginatedData,
  PaginatedRequestQuery,
} from 'src/shared/RequestHelper';
import { IsKlantCollection } from 'src/types/EntityTpes/KlantTypes';
import { adminApi } from 'src/services/Authenticator';
import { KlantNotFoundError, NotAllowedError } from 'src/shared/RequestError';
import { mapToAdminKlantenOverviewResult } from './mappers';
import { KlantDto } from 'src/common/api/types/klant';

interface ListKlantenRequest extends NextApiRequest {
  query: PaginatedRequestQuery;
  url: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // adminApi({ req, res });

    if (req.method !== 'GET') throw new NotAllowedError();

    return getKlantenOverview(req as ListKlantenRequest, res);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

const getKlantenOverview = async (
  req: ListKlantenRequest,
  res: NextApiResponse<PaginatedData<Omit<KlantDto, 'gsm' | 'honden' | 'inschrijvingen'>>>
) => {
  try {
    const data = await getPaginatedData<IsKlantCollection>(req.query, req.url, KLANT);

    const result = mapToAdminKlantenOverviewResult(data);

    return res.status(200).send(result);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

export default handler;
