import { NextApiRequest, NextApiResponse } from 'next';
import { calculateDbSkip, calculatePagination } from 'src/common/api/shared/functions';
import { mapToRasDto } from './mappers';
import { getRassen } from './repo';

export interface ListRequest extends NextApiRequest {
  query: {
    page?: string;
    pageSize: string;
    ids?: string;
    search?: string;
  };
}

const handler = async (req: ListRequest, res: NextApiResponse) => {
  const { page = '1', pageSize = '20', ids, search } = req.query;
  const query = { ids, search };

  const [total, data] = await getRassen(calculateDbSkip(page, pageSize), parseInt(pageSize), query);
  const { first, last, next, prev } = calculatePagination(page, pageSize, total);

  const pagination = { total, page, first, last, next, prev };
  const result = { data: data.map(mapToRasDto), pagination };

  return res.status(200).send(result);
};

export default handler;
