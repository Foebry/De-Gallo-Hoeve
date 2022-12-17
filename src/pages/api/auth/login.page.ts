import { NextApiRequest, NextApiResponse } from "next";
import { validate, validateCsrfToken } from "@/services/Validator";
import { loginSchema } from "@/types/schemas";
import { getKlantByEmail } from "@/controllers/KlantController";
import bcrypt from "bcrypt";
import {
  InvalidEmailError,
  InvalidPasswordError,
  NotAllowedError,
} from "@/shared/RequestError";
import { createJWT, setClientCookie } from "@/services/Authenticator";
import { closeConnection, getConnection } from "@/utils/MongoDb";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST")
    return login(req as GenericRequest<LoginRequest>, res);
  else throw new NotAllowedError();
};

interface LoginRequest extends NextApiRequest {
  body: { email: string; password: string };
  query: Partial<{ a: string }>;
  params: { b: string };
}
export type GenericRequest<T> = T;

const login = async (
  req: GenericRequest<LoginRequest>,
  res: NextApiResponse
) => {
  try {
    await getConnection();
    await validateCsrfToken({ req, res });
    await validate({ req, res }, { schema: loginSchema });
    const b = req.query;
    const p = req.params;
    const { email, password } = req.body;

    const klant = await getKlantByEmail(email.toLowerCase());
    if (!klant) throw new InvalidEmailError();

    const match = await bcrypt.compare(password, klant.password);
    if (!match) throw new InvalidPasswordError();

    createJWT(res, klant);
    setClientCookie(res, klant);

    await closeConnection();

    return res.send({});
  } catch (e: any) {
    res.status(e.code).json(e.response);
  }
};

export default handler;
