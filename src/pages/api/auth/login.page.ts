import { NextApiRequest, NextApiResponse } from 'next';
import { validate, validateCsrfToken } from 'src/services/Validator';
import { loginSchema } from 'src/types/schemas';
import { getKlantByEmail } from 'src/controllers/KlantController';
import bcrypt from 'bcrypt';
import { InvalidEmailError, InvalidPasswordError, NotAllowedError } from 'src/shared/RequestError';
import { createJWT } from 'src/services/Authenticator';
import { logError } from '../logError/repo';
import { AuthDto } from 'src/common/api/dtos/AuthDto';
import { getInschrijvingenByKlantId } from './me/repo';
import { getHondenByKlantId } from 'src/controllers/HondController';
import { mapToAuthResult } from './me/mappers';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') return login(req as LoginRequest, res);
  else throw new NotAllowedError();
};

interface LoginRequest extends NextApiRequest {
  body: { email: string; password: string };
}

const login = async (req: LoginRequest, res: NextApiResponse<AuthDto>) => {
  try {
    await validateCsrfToken({ req, res });
    await validate({ req, res }, { schema: loginSchema, message: 'email of password onjuist' });
    const { email, password } = req.body;

    const klant = await getKlantByEmail(email.toLowerCase());
    if (!klant) throw new InvalidEmailError();

    const match = await bcrypt.compare(password, klant.password);
    if (!match) throw new InvalidPasswordError();

    const inschrijvingen = await getInschrijvingenByKlantId(klant._id);
    const honden = await getHondenByKlantId(klant._id);

    createJWT(res, klant);
    const response = mapToAuthResult(klant, honden, inschrijvingen);

    return res.send(response);
  } catch (e: any) {
    req.body.password = req.body.password ? await bcrypt.hash(req.body.password, 10) : '';
    await logError('login', req, e);
    return res.status(e.code).json(e.response);
  }
};

export default handler;
