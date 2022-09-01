import { NextApiRequest, NextApiResponse } from "next";
import mailer from "../middleware/Mailer";
import client, { getCollections } from "../middleware/MongoDb";
import { internalServerError } from "./ResponseHandler";
import { Hond, Klant } from "../types/collections";
import brcypt from "bcrypt";
import { Collection, ObjectId } from "mongodb";
import moment from "moment";
import { nanoid } from "nanoid";

interface Confirm {
  klant_id: ObjectId;
  code: string;
  created_at: string;
}

interface InsertedKlant extends Klant {
  klantId: ObjectId;
}

interface RegistratieHandlerInterface {
  handleRegistration: (obj: {
    req: NextApiRequest;
    res: NextApiResponse;
  }) => Promise<void>;
  generateKlant: (klantData: Klant, honden: Hond[]) => Promise<Klant>;
  generateConfirm: (klantData: InsertedKlant) => Confirm;
}

const registratieHandler: RegistratieHandlerInterface = {
  handleRegistration: async ({ req, res }) => {
    const { csrf, honden, password_verification, ...klantData } = req.body;

    try {
      await client.connect();
      const { klantCollection, confirmCollection } = getCollections([
        "klant",
        "confirm",
      ]) as {
        klantCollection: Collection<Klant>;
        confirmCollection: Collection<Confirm>;
      };
      const filter = { email: klantData.email.toLowerCase() };
      const emailTaken = await klantCollection.findOne(filter);

      if (emailTaken)
        return res.status(422).json({
          message: "Registratie niet verwerkt",
          email: "Email reeds in gebruik",
        });

      const klant = await generateKlant(klantData, honden);
      const { insertedId: klantId } = await klantCollection.insertOne(klant);

      const confirm = generateConfirm({ ...klantData, klantId });
      console.log({ confirm });
      await confirmCollection.insertOne(confirm);

      mailer.sendMail("register", { ...klantData, confirmCode: confirm.code });

      return res.status(201).json({ message: "Registatie succesvol!" });
    } catch (e: any) {
      console.error(e.message);
      return internalServerError(res);
    } finally {
      await client.close();
    }
  },

  generateKlant: async (klantData, honden) => {
    const klant = {
      ...klantData,
      password: await brcypt.hash(klantData.password, 10),
      honden: honden.map((hond) => ({ ...hond, _id: new ObjectId() })),
      inschrijvingen: [] as ObjectId[],
      reservaties: [] as ObjectId[],
      roles: "[]",
      verified: false,
      email: klantData.email.toLowerCase(),
      created_at: moment().local().format(),
    };
    return klant as Klant;
  },

  generateConfirm: (klantData) => {
    const klant_id = klantData.klantId as ObjectId;
    const code = nanoid(50);
    const created_at = moment().local().format();

    return { klant_id, code, created_at };
  },
};

export const { handleRegistration, generateKlant, generateConfirm } =
  registratieHandler;
