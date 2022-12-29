import { NextApiRequest, NextApiResponse } from "next";
import { validate, validateCsrfToken } from "src/services/Validator";
import { inschrijvingSchema } from "src/types/schemas";
import { secureApi } from "src/services/Authenticator";
import {
  EmailNotVerifiedError,
  HondNotFoundError,
  KlantNotFoundError,
  ReedsIngeschrevenError,
  TrainingNotFoundError,
  TrainingVolzetError,
  TransactionError,
} from "src/shared/RequestError";
import { getKlantById } from "src/controllers/KlantController";
import client, { startTransaction } from "src/utils/MongoDb";
import mailer from "src/utils/Mailer";
import { saveInschrijving } from "src/controllers/InschrijvingController";
import { ObjectId } from "mongodb";
import { getKlantHond } from "src/controllers/HondController";
import {
  getTrainingByName,
  klantReedsIngeschreven,
  trainingVolzet,
} from "src/controllers/TrainingController";
import Factory from "src/services/Factory";
import { IsInschrijvingBody } from "src/types/requestTypes";
import moment from "moment";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") return getInschrijvingen(req, res);
  if (req.method === "POST") return postInschrijving(req, res);
  return res.status(405).json({ code: 405, message: "Not Allowed" });
};

const getInschrijvingen = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { _id: klantId } = secureApi({ req, res });
    await client.connect();
    const klant = await getKlantById(new ObjectId(klantId));
    if (!klant) throw new KlantNotFoundError("Klant niet gevonden");
    const inschrijvingen = klant.inschrijvingen;
    return res.status(200).send(inschrijvingen);
  } catch (e: any) {
    return res.status(e.code).send(e.response);
  }
};

const postInschrijving = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    secureApi({ req, res });
    await client.connect();
    await validateCsrfToken({ req, res });
    await validate({ req, res }, { schema: inschrijvingSchema });

    const { klant_id, training, inschrijvingen, prijs, isFirstInschrijving } =
      req.body as IsInschrijvingBody;

    const klant = await getKlantById(new ObjectId(klant_id));
    if (!klant) throw new KlantNotFoundError();

    if (!klant.verified) throw new EmailNotVerifiedError();

    const selectedTraining = await getTrainingByName(training);
    if (!selectedTraining) throw new TrainingNotFoundError();

    const email = klant.email;
    const naam = klant.vnaam;

    // const data = { email, inschrijvingen };
    const session = client.startSession();
    const ids: string[] = [];

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
            ids.push(newInschrijving._id.toString());
          }, transactionOptions)
        );
      });
    } catch (e: any) {
      throw new TransactionError(e.name, e.code, e.response);
    }

    const data = inschrijvingen
      .map((inschrijving, index) => ({
        [`moment${index}`]: moment(inschrijving.datum)
          .toISOString()
          .replace("T", " ")
          .split(":00.")[0],
        [`hond${index}`]: inschrijving.hond_naam,
        [`prijsExcl${index}`]:
          index === 0 && isFirstInschrijving ? "0.00" : prijs,
        [`prijsIncl${index}`]:
          index === 0 && isFirstInschrijving
            ? "0.00"
            : Math.round(prijs * 1.21).toFixed(2),
      }))
      .reduce((prev, curr) => ({ ...prev, ...curr }), {});

    await mailer.sendMail("inschrijving", { naam, email, ...data });
    await mailer.sendMail("inschrijving-headsup", {
      email: process.env.MAIL_TO,
      _ids: ids.join(","),
    });

    return res.status(201).json({ message: "Inschrijving ontvangen!" });
  } catch (e: any) {
    return res.status(e.code).send(e.response);
  } finally {
    await client.close();
  }
};

export default handler;
