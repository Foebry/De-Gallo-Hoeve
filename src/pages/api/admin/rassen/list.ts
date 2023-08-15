import { NextApiRequest, NextApiResponse } from 'next';
import { calculateDbSkip, calculatePagination } from 'src/common/api/shared/functions';
import { mapToRasDto } from './mappers';
import { getRassen } from './repo';

export interface ListRequest extends NextApiRequest {
  query: {
    page?: string;
    pageSize: string;
    ids?: string;
  };
}

const handler = async (req: ListRequest, res: NextApiResponse) => {
  const { page = '1', pageSize = '20', ids } = req.query;
  const query = { ids };

  const [total, data] = await getRassen(calculateDbSkip(page, pageSize), parseInt(pageSize));
  const { first, last, next, prev } = calculatePagination(page, pageSize, total);

  const pagination = { total, page, first, last, next, prev };
  const result = { data: data.map(mapToRasDto), pagination };

  return res.status(200).send(result);
};

export default handler;
