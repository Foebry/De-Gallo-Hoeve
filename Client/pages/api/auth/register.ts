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
import moment from "moment";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") return register(req, res);
  throw new NotAllowedError();
};

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log({
    formatted: moment().local().format("YYYY-MM-DD HH:mm:SS.mmmm"),
  });
  console.log({
    idk: new Date(moment.utc("2022-12-24 23:59:59").local().toString()),
  });
  console.log({
    dateFromFormat: new Date(moment().format("YYYY-MM-DD HH:mm:ss")),
  });
  console.log({ localMoment: moment().local() });
  console.log({ local: moment().local() });
  console.log({ unix: moment().local().unix() });
  console.log({ dateFromUnix: new Date(moment().local().unix() * 1000) });
  console.log({ localToString: moment().local().toISOString() });
  console.log({ date: new Date("2022-12-12 23:59:59") });
  try {
    await client.connect();
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
      const session = client.startSession();
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
    await client.close();
  }
};

export default handler;
