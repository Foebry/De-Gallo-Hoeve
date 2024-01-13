import { NextApiRequest, NextApiResponse } from 'next';
import { calculateDbSkip, calculatePagination } from 'src/common/api/shared/functions';
import { mapToKlantDto } from './mappers';
import { getKlanten } from './repo';

export interface ListRequest extends NextApiRequest {
  query: Partial<{
    search: string;
    page: string;
    pageSize: string;
    ids: string;
  }>;
}

const handler = async (req: ListRequest, res: NextApiResponse) => {
  try {
    const { search, page = '1', pageSize = '20', ids } = req.query;
    const query = { search, ids };

    const [total, data] = await getKlanten(calculateDbSkip(page, pageSize), parseInt(pageSize), query);
    const { first, last, next, prev } = calculatePagination(page, pageSize, total);

    const pagination = { page, first, last, total, next, prev };
    const result = { data: data.map(mapToKlantDto), pagination };

    return res.status(200).send(result);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

export default handler;
