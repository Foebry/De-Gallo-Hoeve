import { NextApiRequest, NextApiResponse } from "next";
import { validate, validateCsrfToken } from "../../middleware/Validator";
import { inschrijvingSchema } from "../../types/schemas";
import { secureApi } from "../../middleware/Authenticator";
import {
  EmailNotVerifiedError,
  HondNotFoundError,
  InternalServerError,
  KlantNotFoundError,
  ReedsIngeschrevenError,
  TrainingNotFoundError,
  TrainingVolzetError,
  TransactionError,
} from "../../middleware/RequestError";
import { getKlantById } from "../../controllers/KlantController";
import client, { startTransaction } from "../../middleware/MongoDb";
import mailer from "../../middleware/Mailer";
import { saveInschrijving } from "../../controllers/InschrijvingController";
import { ObjectId } from "mongodb";
import { getKlantHond } from "../../controllers/HondController";
import {
  getTrainingByName,
  klantReedsIngeschreven,
  trainingVolzet,
} from "../../controllers/TrainingController";
import Factory from "../../middleware/Factory";
import { IsInschrijvingBody } from "../../types/requestTypes";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") return postInschrijving(req, res);
  return res.status(405).json({ code: 405, message: "Not Allowed" });
};

const postInschrijving = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    secureApi({ req, res });
    await client.connect();
    await validateCsrfToken({ req, res });
    await validate({ req, res }, { schema: inschrijvingSchema });

    const { klant_id, training, inschrijvingen } =
      req.body as IsInschrijvingBody;

    const klant = await getKlantById(new ObjectId(klant_id));
    if (!klant) throw new KlantNotFoundError();

    if (!klant.verified) throw new EmailNotVerifiedError();

    const selectedTraining = await getTrainingByName(training);
    if (!selectedTraining) throw new TrainingNotFoundError();

    const email = klant.email;
    const data = { email, inschrijvingen };
    const session = client.startSession();

    const transactionOptions = startTransaction();
    try {
      await session.withTransaction(async () => {
        await Promise.all(
          inschrijvingen.map(async (inschrijving, index) => {
            const hond = await getKlantHond(
              klant,
              new ObjectId(inschrijving.hond_id)
            );
            if (!hond) throw new HondNotFoundError();

            if (await klantReedsIngeschreven(klant, training, inschrijving))
              throw new ReedsIngeschrevenError({
                [`inschrijvingen[${index}][timeslot]`]:
                  "U bent reeds ingeschreven voor deze training",
                message: "Inschrijving niet verwerkt",
              });
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
      throw new TransactionError(e.name, e.code, e.response);
    }
    if (process.env.NODE_ENV !== "test") {
      mailer.sendMail("inschrijving", data);
    }

    return res.status(201).json({ message: "Inschrijving ontvangen!" });
  } catch (e: any) {
    return res.status(e.code).send(e.response);
  } finally {
    await client.close();
  }
};

export default handler;
