import { NextApiRequest, NextApiResponse } from 'next';
import { INSCHRIJVING } from 'src/controllers/InschrijvingController';
import {
  getPaginatedData,
  PaginatedRequestQuery,
  PaginatedResponse,
} from 'src/shared/RequestHelper';
import { InschrijvingCollection } from 'src/types/EntityTpes/InschrijvingTypes';
import { adminApi } from 'src/services/Authenticator';
import { NotAllowedError } from 'src/shared/RequestError';
import { InschrijvingDto } from 'src/common/api/types/inschrijving';
import { mapToAdminInschrijvingenOverviewResult } from './mappers';

interface ListInschrijvingRequest extends NextApiRequest {
  query: PaginatedRequestQuery;
  url: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // adminApi({ req, res });

    if (req.method !== 'GET') throw new NotAllowedError();

    return getInschrijvingOverview(req as ListInschrijvingRequest, res);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

const getInschrijvingOverview = async (
  req: ListInschrijvingRequest,
  res: NextApiResponse<PaginatedResponse<InschrijvingDto>>
) => {
  try {
    const data = await getPaginatedData<InschrijvingCollection>(
      { ...req.query, amount: '2' },
      req.url,
      INSCHRIJVING
    );

    const result = mapToAdminInschrijvingenOverviewResult(data);

    return res.status(200).send(result);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

export default handler;
