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
import { CONFIRM } from 'src/types/EntityTpes/ConfirmTypes';
import { logError } from 'src/controllers/ErrorLogController';
import { startSession, startTransaction } from 'src/utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') return register(req, res);
  throw new NotAllowedError();
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

    try {
      const session = await startSession();
      const transactionOptions = startTransaction();
      await session.withTransaction(async () => {
        const savedKlant = await getController(KLANT).save(klant);
        const confirm = Factory.createConfirm({
          klant_id: klant._id,
          created_at: klant.created_at,
        });
        const { code } = await getController(CONFIRM).save(confirm);

        await mailer.sendMail('register', {
          email: savedKlant.email,
          vnaam: savedKlant.vnaam,
          code,
        });
        await mailer.sendMail('register-headsup', {
          email: process.env.MAIL_TO,
          klant_id: savedKlant._id.toString(),
        });
      }, transactionOptions);

      return res.status(201).send(klant);
    } catch (e: any) {
      throw new TransactionError(e.name, e.code, e.response);
    }
  } catch (e: any) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    await logError('register', req, e);
    return res.status(e.code).json(e.response);
  }
};

export default handler;
