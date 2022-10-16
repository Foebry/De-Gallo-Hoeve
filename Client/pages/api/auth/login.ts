import { NextApiRequest, NextApiResponse } from "next";
import { validate, validateCsrfToken } from "../../../middleware/Validator";
import { loginSchema } from "../../../types/schemas";
import { getKlantByEmail } from "../../../controllers/KlantController";
import bcrypt from "bcrypt";
import {
  InvalidEmailError,
  InvalidPasswordError,
  NotAllowedError,
} from "../../../middleware/RequestError";
import { createJWT, setClientCookie } from "../../../middleware/Authenticator";
import client from "../../../middleware/MongoDb";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") return login(req, res);
  else throw new NotAllowedError();
};

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await client.connect();
    await validateCsrfToken({ req, res });
    await validate({ req, res }, { schema: loginSchema });

    const { email, password } = req.body;

    const klant = await getKlantByEmail(email.toLowerCase());
    if (!klant) throw new InvalidEmailError();

    const match = await bcrypt.compare(password, klant.password);
    if (!match) throw new InvalidPasswordError();

    createJWT(res, klant);
    setClientCookie(res, klant);

    await client.close();

    return res.send({});
  } catch (e: any) {
    res.status(e.code).json(e.response);
  }
};

export default handler;
