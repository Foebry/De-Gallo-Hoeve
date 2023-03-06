import { NextApiResponse } from 'next';
import { getKlantById } from 'src/controllers/KlantController';
import { FrontEndErrorCodes, getDomain } from 'src/shared/functions';
import {
  ConflictError,
  KlantAlreadyVerifiedError,
  KlantNotFoundError,
} from 'src/shared/RequestError';
import mailer, { sendResetConfirmMail } from 'src/utils/Mailer';
import { logError } from '../../logError/repo';
import { createRandomConfirmCode, getKlantIdFromConfirmCode } from './repo';
import { ResetRequest } from './schemas';

export const reset = async (req: ResetRequest, res: NextApiResponse) => {
  try {
    const { code } = req.query;

    const [klantId] = getKlantIdFromConfirmCode(code);
    const klant = await getKlantById(klantId);
    if (!klant) throw new KlantNotFoundError();

    if (klant.verified) throw new KlantAlreadyVerifiedError();

    const newCode = createRandomConfirmCode(klant._id);

    await sendResetConfirmMail(klant, newCode, getDomain(req));

    return res.status(200).json({});
  } catch (e: any) {
    await logError('reset', req, e);
    return res.status(e.code).send(e.response);
  }
};
