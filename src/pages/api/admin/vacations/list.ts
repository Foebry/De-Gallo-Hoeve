import { NextApiRequest, NextApiResponse } from 'next';
import Vacation from 'src/common/domain/entities/Vacation';
import {
  calculateDbSkip,
  getPagination,
  PaginatedRequestQuery,
} from 'src/shared/RequestHelper';
import { mapVacationToDto } from './mappers';
import { getVacationsList } from './repo';

export interface ListVacationRequest extends NextApiRequest {
  query: PaginatedRequestQuery;
  url: string;
}

export const getVacationsOverview = async (
  req: ListVacationRequest,
  res: NextApiResponse
) => {
  try {
    const { query, url } = req;
    const { page = '1', amount = '20', search } = req.query;
    const data = await getVacationsList(
      calculateDbSkip(page, amount),
      parseInt(amount),
      search
    );
    console.log({ data });

    const pagination = getPagination<Vacation>({ page, amount }, url, data);
    const result = {
      pagination,
      data: data.map((vacation) => mapVacationToDto(vacation)),
    };

    return res.status(200).send(result);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};
