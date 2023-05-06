import { NextApiRequest, NextApiResponse } from 'next';
import { validate, validateCsrfToken } from 'src/services/Validator';
import { inschrijvingSchema } from 'src/types/schemas';
import { secureApi, verifiedUserApi } from 'src/services/Authenticator';
import {
  HondNotFoundError,
  KlantNotFoundError,
  ReedsIngeschrevenError,
  TrainingNotFoundError,
  TrainingVolzetError,
  TransactionError,
} from 'src/shared/RequestError';
import { getKlantById } from 'src/controllers/KlantController';
import mailer from 'src/utils/Mailer';
import { ObjectId } from 'mongodb';
import { getKlantHond } from 'src/controllers/HondController';
import {
  getTrainingByName,
  klantReedsIngeschreven,
  trainingVolzet,
} from 'src/controllers/TrainingController';
import Factory from 'src/services/Factory';
import { IsInschrijvingBody } from 'src/types/requestTypes';
import { save } from 'src/controllers/InschrijvingController';
import { startSession, startTransaction } from 'src/utils/db';
import { mapInschrijvingen } from 'src/mappers/Inschrijvingen';
import { getDomain } from 'src/shared/functions';
import { TrainingType } from '@/types/EntityTpes/TrainingType';
import { Geslacht } from '@/types/EntityTpes/HondTypes';
import { logError } from './logError/repo';

type InschrijvingDto = {
  datum: string;
  hond_id: string;
  hond_naam: string;
  hond_geslacht: Geslacht;
};

interface PostInschrijvingRequest extends NextApiRequest {
  body: {
    klant_id: string;
    training: TrainingType;
    inschrijvingen: InschrijvingDto[];
    prijs: number;
  };
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') return getInschrijvingen(req, res);
  if (req.method === 'POST') return postInschrijving(req, res);
  return res.status(405).json({ code: 405, message: 'Not Allowed' });
};

const getInschrijvingen = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { _id: klantId } = secureApi({ req, res });
    const klant = await getKlantById(new ObjectId(klantId));
    if (!klant) throw new KlantNotFoundError('Klant niet gevonden');

    const inschrijvingen = klant.inschrijvingen;

    return res.status(200).send(inschrijvingen);
  } catch (e: any) {
    await logError('inschrijving', req, e);
    return res.status(e.code).send(e.response);
  }
};

const postInschrijving = async (req: PostInschrijvingRequest, res: NextApiResponse) => {
  try {
    verifiedUserApi({ req, res });

    await validateCsrfToken({ req, res });
    await validate({ req, res }, { schema: inschrijvingSchema });

    const { klant_id, training, inschrijvingen, prijs } = req.body;

    const klant = await getKlantById(new ObjectId(klant_id));
    if (!klant) throw new KlantNotFoundError();

    const isFirstInschrijving = !klant.inschrijvingen.length;

    const selectedTraining = await getTrainingByName(training);
    if (!selectedTraining) throw new TrainingNotFoundError();

    const email = klant.email;
    const naam = klant.vnaam;

    const session = await startSession();
    const ids: string[] = [];

    const transactionOptions = startTransaction();
    try {
      await session.withTransaction(async () => {
        for (const inschrijving of inschrijvingen) {
          const index = inschrijvingen.indexOf(inschrijving);
          const hondId = new ObjectId(inschrijving.hond_id);
          const hond = await getKlantHond(klant._id, hondId);
          if (!hond) throw new HondNotFoundError();

          const newInschrijving = Factory.createInschrijving(
            inschrijving,
            training,
            klant,
            hond
          );

          if (await klantReedsIngeschreven(klant, training, newInschrijving))
            throw new ReedsIngeschrevenError(index);
          if (await trainingVolzet(selectedTraining, newInschrijving.datum))
            throw new TrainingVolzetError();

          await save(newInschrijving, session);
          ids.push(newInschrijving._id.toString());
        }
      }, transactionOptions);
    } catch (e: any) {
      throw new TransactionError(e.name, e.code, e.response);
    }

    const data = mapInschrijvingen(inschrijvingen, isFirstInschrijving, prijs);

    await mailer.sendMail('inschrijving', {
      naam,
      email: process.env.MAIL_TEST ?? email,
      ...data,
    });
    await mailer.sendMail('inschrijving-headsup', {
      email: process.env.MAIL_TEST ?? process.env.MAIL_TO,
      _ids: ids.join(','),
      domain: getDomain(req),
    });
    return res.status(201).json({ message: 'Inschrijving ontvangen!' });
  } catch (e: any) {
    await logError('inschrijving', req, e);
    return res.status(e.code).send(e.response);
  }
};
export default handler;
