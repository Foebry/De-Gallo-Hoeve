import { NextApiRequest, NextApiResponse } from "next";
import { validateCsrfToken, validate } from "../../../middleware/Validator";
import mailer from "../../../middleware/Mailer";
import client, { startTransaction } from "../../../middleware/MongoDb";
import {
  EmailOccupiedError,
  NotAllowedError,
  TransactionError,
} from "../../../middleware/RequestError";
import { registerSchema } from "../../../types/schemas";
import Factory from "../../../middleware/Factory";
import { getKlantByEmail, KLANT } from "../../../controllers/KlantController";
import { IsRegisterBody } from "../../../types/requestTypes";
import { CONFIRM } from "../../../types/EntityTpes/ConfirmTypes";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") return register(req, res);
  throw new NotAllowedError();
};

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await client.connect();
    await validateCsrfToken({ req, res });
    await validate({ req, res }, { schema: registerSchema });

    const { csrf, ...klantData } = req.body as IsRegisterBody;
    const existingKlant = await getKlantByEmail(klantData.email);
    if (existingKlant) throw new EmailOccupiedError();

    const klant = await Factory.createKlant(klantData);

    try {
      const session = client.startSession();
      const transactionOptions = startTransaction();
      await session.withTransaction(async () => {
        const savedKlant = await Factory.getController(KLANT).save(klant);
        const confirm = Factory.createConfirm({
          klant_id: klant._id,
          created_at: savedKlant.created_at,
        });
        const { code } = await Factory.getController(CONFIRM).saveConfirm(
          confirm
        );

        if (process.env.NODE_ENV !== "test") {
          mailer.sendMail("register", {
            email: savedKlant.email,
            vnaam: savedKlant.vnaam,
            code,
          });
        }
      }, transactionOptions);
      const returnKlant = await Factory.getController(KLANT).getKlantByEmail(
        klantData.email
      );
      return res
        .status(201)
        .json({ ...returnKlant, message: "Registratie succesvol!" });
    } catch (e: any) {
      throw new TransactionError(e.name, e.code, e.response);
    }
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  } finally {
    await client.close();
  }
};

export default handler;
