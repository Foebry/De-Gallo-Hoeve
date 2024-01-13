import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { AuthDto } from 'src/common/api/dtos/AuthDto';
import { getHondenByKlantId } from 'src/controllers/HondController';
import { getTokenFromRequest, verifyToken } from 'src/services/Authenticator';
import { KlantNotFoundError } from 'src/shared/RequestError';
import { mapToAuthResult } from './mappers';
import { getInschrijvingenByKlantId, getKlantById } from './repo';

export const getKlantData = async (req: NextApiRequest, res: NextApiResponse<AuthDto>) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return res.status(200).send({ loggedIn: false });

    const { _id: klantId } = verifyToken(token);

    const klant = await getKlantById(klantId);
    if (!klant) throw new KlantNotFoundError();

    const honden = await getHondenByKlantId(new ObjectId(klantId));
    const inschrijvingen = await getInschrijvingenByKlantId(klantId);

    const result = mapToAuthResult(klant, honden, inschrijvingen);
    return res.status(200).send(result);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};
