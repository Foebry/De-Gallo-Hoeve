import { NextApiRequest, NextApiResponse } from "next";
import mailer from "../middleware/Mailer";
import client from "../middleware/MongoDb";
import {
  createKlant,
  getKlantByEmail,
  NewKlant,
} from "../controllers/KlantController";
import { createConfirm } from "../controllers/ConfirmController";
import { EmailOccupiedError } from "../middleware/RequestError";

interface RegistratieInterface extends NewKlant {
  csrf: string;
  password_verification: string;
}

interface RegistratieHandlerInterface {
  handleRegistration: (obj: {
    req: NextApiRequest;
    res: NextApiResponse;
  }) => Promise<void>;
}

const registratieHandler: RegistratieHandlerInterface = {
  handleRegistration: async ({ req, res }) => {
    const { csrf, password_verification, ...klantData } =
      req.body as RegistratieInterface;

    await client.connect();

    const klant = await getKlantByEmail(client, klantData.email);
    if (klant) throw new EmailOccupiedError(res);

    const { _id, created_at, email, vnaam } = await createKlant(
      client,
      klantData
    );
    const { code } = await createConfirm(client, { klant_id: _id, created_at });

    mailer.sendMail("register", {
      email,
      vnaam,
      code,
    });

    await client.close();
  },
};

export const { handleRegistration } = registratieHandler;
