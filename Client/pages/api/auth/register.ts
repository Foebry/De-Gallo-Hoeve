import { NextApiRequest, NextApiResponse } from "next";
import { validateCsrfToken, validate } from "../../../middleware/Validator";
import mailer from "../../../middleware/Mailer";
import client from "../../../middleware/MongoDb";
import { EmailOccupiedError } from "../../../middleware/RequestError";
import { registerSchema } from "../../../types/schemas";
import Factory from "../../../middleware/Factory";
import { CONFIRM } from "../../../controllers/ConfirmController";
import { getKlantByEmail, KLANT } from "../../../controllers/KlantController";

// interface RegisterBody {

// }

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  req.method === "POST"
    ? register(req, res)
    : res.status(405).json({ code: 405, message: "Not Allowed" });
};

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await client.connect();
    await validateCsrfToken({ req, res });
    await validate({ req, res }, { schema: registerSchema });

    const { csrf, password_verification, ...klantData } = req.body;
    const existingKlant = await getKlantByEmail(klantData.email);
    if (existingKlant) throw new EmailOccupiedError();

    const klant = Factory.createKlant(klantData);
    const { created_at, email, vnaam } = await Factory.getController(
      KLANT
    ).save(klant);
    const confirm = Factory.createConfirm({ klant_id: klant._id, created_at });
    const { code } = await Factory.getController(CONFIRM).saveConfirm(confirm);

    mailer.sendMail("register", { email, vnaam, code });

    return res.status(201).json({ message: "Registratie succesvol!" });
  } catch (e: any) {
    res.status(e.code).json(e.response);
  }
};

export default handler;
