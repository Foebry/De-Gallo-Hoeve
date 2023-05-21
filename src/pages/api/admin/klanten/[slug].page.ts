import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { KlantDto } from 'src/common/api/types/klant';
import { getInschrijvingenByIds } from 'src/controllers/InschrijvingController';
import { getKlantById } from 'src/controllers/KlantController';
import { adminApi } from 'src/services/Authenticator';
import { KlantNotFoundError, NotAllowedError } from 'src/shared/RequestError';
import { DetailRequest } from '../inschrijvingen/[slug].page';
import { mapToKlantDetail } from './mappers';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    adminApi({ req, res });

    if (req.method !== 'GET') throw new NotAllowedError();

    return getKlantDetail(req as DetailRequest, res);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

const getKlantDetail = async (req: DetailRequest, res: NextApiResponse<KlantDto>) => {
  try {
    const { slug: _id } = req.query;

    const klant = await getKlantById(new ObjectId(_id));
    if (!klant) throw new KlantNotFoundError();

    const inschrijvingen = await getInschrijvingenByIds(klant.inschrijvingen);

    const result = mapToKlantDetail(klant, inschrijvingen);

    return res.status(200).send(result);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

export default handler;
