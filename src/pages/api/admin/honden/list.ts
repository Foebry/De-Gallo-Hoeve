import { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { calculateDbSkip, calculatePagination } from 'src/common/api/shared/functions';
import { logError } from '../../logError/repo';
import { mapToHondDto } from './mappers';
import { getHonden } from './repo';

export interface ListRequest extends NextApiRequest {
  query: {
    page?: string;
    pageSize?: string;
    ids?: string;
  };
}

const handler = async (req: ListRequest, res: NextApiResponse) => {
  try {
    const { page = '1', pageSize = '20', ids } = req.query;
    const query = { ids };

    const [total, data] = await getHonden(calculateDbSkip(page, pageSize), parseInt(pageSize), query);
    const { first, last, next, prev } = calculatePagination(page, pageSize, total);

    const pagination = { page, first, last, total, next, prev };
    const result = { data: data.map(mapToHondDto), pagination };

    return res.status(200).send(result);
  } catch (e: unknown) {
    await logError('/admin/honden/list', req, e);
    const isAxiosError = e instanceof AxiosError;
    if (!isAxiosError) return res.status(500).send({ message: 'Er is iets foutgelopen' });

    return res.status(parseInt(e.code!)).json(e.response);
  }
};

export default handler;
