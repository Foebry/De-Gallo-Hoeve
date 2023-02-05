import { NextApiRequest, NextApiResponse } from "next";
import { validate, validateCsrfToken } from "src/services/Validator";
import { loginSchema } from "src/types/schemas";
import { getKlantByEmail } from "src/controllers/KlantController";
import bcrypt from "bcrypt";
import {
  InvalidEmailError,
  InvalidPasswordError,
  NotAllowedError,
} from "src/shared/RequestError";
import { createJWT, setClientCookie } from "src/services/Authenticator";
import { logError } from "src/controllers/ErrorLogController";
import { closeClient } from "src/utils/db";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST")
    return login(req as GenericRequest<LoginRequest>, res);
  else throw new NotAllowedError();
};

interface LoginRequest extends NextApiRequest {
  body: { email: string; password: string };
}
export type GenericRequest<T> = T;

const login = async (
  req: GenericRequest<LoginRequest>,
  res: NextApiResponse
) => {
  try {
    await validateCsrfToken({ req, res });
    await validate({ req, res }, { schema: loginSchema });
    const { email, password } = req.body;

    const klant = await getKlantByEmail(email.toLowerCase());
    if (!klant) throw new InvalidEmailError();
    const match = await bcrypt.compare(password, klant.password);
    if (!match) throw new InvalidPasswordError();

    createJWT(res, klant);
    setClientCookie(res, klant);

    //closeClient(;

    return res.send({});
  } catch (e: any) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    await logError("login", req, e);
    //closeClient(;
    return res.status(e.code).json(e.response);
  }
};

export default handler;
