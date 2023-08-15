import { NextApiRequest, NextApiResponse } from 'next';
import { calculateDbSkip, calculatePagination } from 'src/common/api/shared/functions';
import { VacationQuery } from 'src/context/VacationContext';
import { mapVacationToDto } from './mappers';
import { getVacationsList } from './repo';

export interface ListVacationRequest extends NextApiRequest {
  query: VacationQuery;
  url: string;
}

export const getVacationsOverview = async (req: ListVacationRequest, res: NextApiResponse) => {
  try {
    const { page = '1', pageSize = '20' } = req.query;

    const [total, vacations] = await getVacationsList(calculateDbSkip(page, pageSize), parseInt(pageSize));

    const { first, last, next, prev } = calculatePagination(page, pageSize, total);
    const pagination = { page, first, last, total, next, prev };

    const result = {
      pagination,
      data: vacations.map((vacation) => mapVacationToDto(vacation)),
    };

    return res.status(200).send(result);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};
