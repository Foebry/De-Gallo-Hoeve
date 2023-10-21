import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { HondDto } from 'src/common/api/types/hond';
import { InschrijvingDto } from 'src/common/api/types/inschrijving';
import { getHondenByKlantId } from 'src/controllers/HondController';
import { getTokenFromRequest, verifyToken } from 'src/services/Authenticator';
import { NotAllowedError } from 'src/shared/RequestError';
import { REQUEST_METHOD } from 'src/utils/axios';
import { mapToAuthResult } from './mappers';
import { getInschrijvingenByKlantId } from './repo';

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

const getKlantData = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return res.status(200).send({ loggedIn: false });

    const { _id: klantId, roles } = verifyToken(token);
    const honden = await getHondenByKlantId(new ObjectId(klantId));
    const inschrijvingen = await getInschrijvingenByKlantId(klantId);

    const result = mapToAuthResult(honden, inschrijvingen, roles);
    return res.status(200).send(result);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

export default handler;
