import { NextApiRequest, NextApiResponse } from "next";
import { validateCsrfToken, validate } from "src/services/Validator";
import mailer from "src/utils/Mailer";
import {
  closeConnection,
  getConnection,
  startTransaction,
} from "src/utils/MongoDb";
import {
  EmailOccupiedError,
  NotAllowedError,
  TransactionError,
} from "src/shared/RequestError";
import { registerSchema } from "src/types/schemas";
import Factory from "src/services/Factory";
import { getKlantByEmail, KLANT } from "src/controllers/KlantController";
import { IsRegisterBody } from "src/types/requestTypes";
import { CONFIRM } from "src/types/EntityTpes/ConfirmTypes";
import moment from "moment";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") return register(req, res);
  throw new NotAllowedError();
};

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await getConnection();
    await validateCsrfToken({ req, res });
    await validate(
      { req, res },
      { schema: registerSchema, message: "Registratie niet verwerkt" }
    );

    const { csrf, ...klantData } = req.body as IsRegisterBody;
    const existingKlant = await getKlantByEmail(klantData.email);
    if (existingKlant) throw new EmailOccupiedError();

    const klant = await Factory.createKlant(klantData);

    try {
      const connection = await getConnection();
      const session = connection.startSession();
      const transactionOptions = startTransaction();
      await session.withTransaction(async () => {
        const savedKlant = await Factory.getController(KLANT).save(klant);
        const confirm = Factory.createConfirm({
          klant_id: klant._id,
          created_at: klant.created_at,
        });
        const { code } = await Factory.getController(CONFIRM).saveConfirm(
          confirm
        );

        if (process.env.NODE_ENV !== "test") {
          await mailer.sendMail("register", {
            email: savedKlant.email,
            vnaam: savedKlant.vnaam,
            code,
          });
          await mailer.sendMail("register-headsup", {
            email: "info@degallohoeve.be",
            klant_id: savedKlant._id.toString(),
          });
        }
      }, transactionOptions);
      // const result = createKlantDto(klant);
      const returnKlant = await Factory.getController(KLANT).getKlantByEmail(
        klantData.email
      );
      return res.status(201).send(klant);
    } catch (e: any) {
      throw new TransactionError(e.name, e.code, e.response);
    }
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  } finally {
    await closeConnection();
  }
};

export default handler;
