import { NextApiResponse } from 'next';
import { getKlantById, setVerified } from 'src/controllers/KlantController';
import { logError } from '../../logError/repo';
import { getIdAndExpirationTimeFromCode } from './repo';
import { ConfirmRequest } from './schemas';
import { FrontEndErrorCodes } from 'src/shared/functions';

export const confirm = async (req: ConfirmRequest, res: NextApiResponse) => {
  try {
    const { code } = req.query;

    const [klant_id, validTo] = getIdAndExpirationTimeFromCode(code);
    const klant = await getKlantById(klant_id);
    if (!klant) return res.redirect(`/error?${FrontEndErrorCodes.KlantNotFound}`);

    if (klant.verified) return res.redirect('/login');
    if (new Date().getTime() > validTo)
      return res.redirect(`/error?${FrontEndErrorCodes.ExpiredConfirmCode}&code=${code}`);

    await setVerified(klant);

    return res.redirect('/login');
  } catch (e: any) {
    await logError('confirm', req, e);
    return res.status(e.code).send(e.response);
  }
};
