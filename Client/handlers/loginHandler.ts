import { NextApiRequest, NextApiResponse } from "next";
import client from "../middleware/MongoDb";
import brcypt from "bcrypt";
import { createJWT, setClientCookie } from "./authenticationHandler";
import { getKlantByEmail } from "../controllers/KlantController";
import {
  InvalidEmailError,
  InvalidPasswordError,
} from "../middleware/RequestError";

interface LoginInterface {
  email: string;
  password: string;
}

interface LoginHandlerInterface {
  onLoginSuccess: (obj: {
    req: NextApiRequest;
    res: NextApiResponse;
  }) => Promise<void>;
}

const loginHandler: LoginHandlerInterface = {
  onLoginSuccess: async ({ req, res }) => {
    await client.connect();

    const { email, password } = req.body as LoginInterface;
    const klant = await getKlantByEmail(client, email.toLowerCase());

    if (!klant) throw new InvalidEmailError(res);

    const { _id, vnaam, honden, verified, roles } = klant;
    const payload = { _id, vnaam, honden, verified, roles };

    const match = await brcypt.compare(password, klant.password);
    if (!match) throw new InvalidPasswordError(res);

    createJWT(res, payload);
    setClientCookie(res, payload);

    return res.send({});
  },
};

export const { onLoginSuccess } = loginHandler;
