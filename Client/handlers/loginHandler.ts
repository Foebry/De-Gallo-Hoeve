import { NextApiRequest, NextApiResponse } from "next";
import { findOneBy } from "../middleware/MongoDb";
import { badRequest } from "./ResponseHandler";
import { Klant } from "../types/collections";
import brcypt from "bcrypt";
import { createJWT, setClientCookie } from "./authenticationHandler";

interface LoginHandlerInterface {
  onLoginSuccess: (obj: {
    req: NextApiRequest;
    res: NextApiResponse;
  }) => Promise<void>;
}

const loginHandler: LoginHandlerInterface = {
  onLoginSuccess: async ({ req, res }) => {
    const { email, password } = req.body;
    const klant = (await findOneBy("klant", {
      email: email.toLowerCase(),
    })) as Klant;
    if (!klant) return badRequest(res, undefined, { email: "Foutieve email" });

    const { lnaam, gsm, straat, nr, gemeente, postcode, ...payload } = klant;
    const match = await brcypt.compare(password, payload.password);
    if (!match)
      return badRequest(res, undefined, { password: "Foutief wachtwoord" });

    createJWT(res, payload);
    setClientCookie(res, payload);
    return res.send({});
  },
};

export const { onLoginSuccess } = loginHandler;
