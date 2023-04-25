import { NextApiRequest, NextApiResponse } from 'next';
import { validateCsrfToken, validate } from 'src/services/Validator';
import mailer from 'src/utils/Mailer';
import bcrypt from 'bcrypt';
import {
  EmailOccupiedError,
  NotAllowedError,
  TransactionError,
} from 'src/shared/RequestError';
import { registerSchema } from 'src/types/schemas';
import Factory, { getController } from 'src/services/Factory';
import { getKlantByEmail, KLANT } from 'src/controllers/KlantController';
import { IsRegisterBody } from 'src/types/requestTypes';
import { getDomain } from 'src/shared/functions';
import { logError } from '../logError/repo';
import { createRandomConfirmCode } from '../confirm/[code]/repo';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') throw new NotAllowedError();

    return register(req, res);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await validateCsrfToken({ req, res });
    await validate(
      { req, res },
      { schema: registerSchema, message: 'Registratie niet verwerkt' }
    );

    const { csrf, ...klantData } = req.body as IsRegisterBody;
    const existingKlant = await getKlantByEmail(klantData.email);
    if (existingKlant) throw new EmailOccupiedError();

    const klant = await Factory.createKlant(klantData);

    const savedKlant = await getController(KLANT).save(klant);
    const code = createRandomConfirmCode(savedKlant._id);

    await mailer.sendMail('register', {
      email: process.env.MAIL_TO ?? savedKlant.email,
      vnaam: savedKlant.vnaam,
      code,
      domain: getDomain(req),
    });
    await mailer.sendMail('register-headsup', {
      email: process.env.MAIL_TO,
      klant_id: savedKlant._id.toString(),
      domain: getDomain(req),
    });

    return res.status(201).send(klant);
  } catch (e: any) {
    req.body.password = req.body.password ? await bcrypt.hash(req.body.password, 10) : '';
    await logError('register', req, e);
    return res.status(e.code).json(e.response);
  }
};

export default handler;
