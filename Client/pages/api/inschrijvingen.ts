import { NextApiRequest, NextApiResponse } from "next";
import { validate, validateCsrfToken } from "../../middleware/Validator";
import { inschrijvingSchema } from "../../types/schemas";
import { secureApi } from "../../middleware/Authenticator";
import {
  HondNotFoundError,
  InternalServerError,
  KlantNotFoundError,
  ReedsIngeschrevenError,
  TrainingNotFoundError,
  TrainingVolzetError,
} from "../../middleware/RequestError";
import { getKlantById } from "../../controllers/KlantController";
import client, { startTransaction } from "../../middleware/MongoDb";
import mailer from "../../middleware/Mailer";
import {
  InschrijvingBodyInterface,
  saveInschrijving,
} from "../../controllers/InschrijvingController";
import { ObjectId } from "mongodb";
import { getKlantHond } from "../../controllers/HondController";
import {
  getTrainingByName,
  klantReedsIngeschreven,
  trainingVolzet,
} from "../../controllers/TrainingController";
import Factory from "../../middleware/Factory";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return req.method === "POST"
    ? postInschrijving(req, res)
    : res.status(405).json({ code: 405, message: "Not Allowed" });
};

const postInschrijving = async (req: NextApiRequest, res: NextApiResponse) => {
  secureApi({ req, res });
  try {
    await client.connect();
    await validateCsrfToken({ req, res });
    await validate({ req, res }, { schema: inschrijvingSchema });

    const { klant_id, training, inschrijvingen } =
      req.body as InschrijvingBodyInterface;

    const klant = await getKlantById(new ObjectId(klant_id));
    if (!klant) throw new KlantNotFoundError();
    if (!(await getTrainingByName(training))) throw new TrainingNotFoundError();

    const email = klant.email;
    const data = { email, inschrijvingen };
    const session = client.startSession();

    const transactionOptions = startTransaction();

    try {
      await session.withTransaction(async () => {
        await Promise.all(
          inschrijvingen.map(async (inschrijving) => {
            const hond = await getKlantHond(
              klant._id,
              new ObjectId(inschrijving.hond_id)
            );
            if (!hond) throw new HondNotFoundError();

            if (await klantReedsIngeschreven(klant, training, inschrijving))
              throw new ReedsIngeschrevenError();
            if (await trainingVolzet(training, inschrijving.datum))
              throw new TrainingVolzetError("Dit tijdstip is niet meer vrij");

            const newInschrijving = Factory.createInschrijving(
              inschrijving,
              training,
              klant,
              hond
            );

            await saveInschrijving(newInschrijving, session);
          }, transactionOptions)
        );
      });
    } catch (e: any) {
      session.abortTransaction();
      throw new InternalServerError();
    }
    mailer.sendMail("inschrijving", data);

    return res.status(201).json({ message: "Inschrijving ontvangen!" });
  } catch (e: any) {
    return res.status(e.code).send(e.response);
  } finally {
    await client.close();
  }
};

export default handler;
