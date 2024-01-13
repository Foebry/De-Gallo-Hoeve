import { NextApiRequest, NextApiResponse } from 'next';
import { HondDto } from 'src/common/api/types/hond';
import { InschrijvingDto } from 'src/common/api/types/inschrijving';
import { NotAllowedError } from 'src/shared/RequestError';
import { REQUEST_METHOD } from 'src/utils/axios';
import { getKlantData } from './getKlantData';

type Response = {
  loggedIn: boolean;
  honden?: Omit<HondDto, 'klant'>[];
  inschrijvingen?: InschrijvingDto[];
  role?: string;
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === REQUEST_METHOD.GET) return getKlantData(req, res);
    throw new NotAllowedError();
  } catch (e: any) {
    res.status(e.code).json(e.response);
  }
};

export default handler;
