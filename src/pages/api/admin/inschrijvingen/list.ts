import { NextApiRequest, NextApiResponse } from 'next';
import { calculateDbSkip, calculatePagination } from 'src/common/api/shared/functions';
import { mapToInschrijvingDto } from './mappers';
import { getInschrijvingen } from './repo';

export interface ListRequest extends NextApiRequest {
  query: {
    page: string;
    pageSize: string;
    ids: string;
  };
}

const handler = async (req: ListRequest, res: NextApiResponse) => {
  try {
    const { page = '1', pageSize = '20', ids } = req.query;
    const query = { ids };

    const [total, data] = await getInschrijvingen(calculateDbSkip(page, pageSize), parseInt(pageSize), query);
    const { first, last, next, prev } = calculatePagination(page, pageSize, total);

    return res.status(200).send({
      data: data.map(mapToInschrijvingDto),
      pagination: {
        page,
        first,
        last,
        total,
        next,
        prev,
      },
    });
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

export default handler;
