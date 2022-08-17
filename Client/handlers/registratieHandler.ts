import { NextApiRequest, NextApiResponse } from "next";
import mailer from "../middleware/Mailer";
import client from "../middleware/MongoDb";
import { internalServerError } from "./ResponseHandler";
import {
  Hond,
  Klant,
  KlantInschrijving,
  KlantReservatie,
} from "../types/collections";
import brcypt from "bcrypt";

interface RegistratieHandlerInterface {
  handleRegistration: (obj: {
    req: NextApiRequest;
    res: NextApiResponse;
  }) => Promise<void>;
  generateKlant: (klantData: Klant, honden: Hond[]) => Promise<Klant>;
}

const registratieHandler: RegistratieHandlerInterface = {
  handleRegistration: async ({ req, res }) => {
    const { csrf, honden, password_verification, ...klantData } = req.body;

    try {
      await client.connect();

      const klantCollection = client.db("degallohoeve").collection("klant");
      const filter = { email: klantData.email.toLowerCase() };
      const emailTaken = await klantCollection.findOne(filter);

      if (emailTaken)
        return res.status(422).json({
          message: "Registratie niet verwerkt",
          email: "Email reeds in gebruik",
        });

      const klant = await generateKlant(klantData, honden);
      await klantCollection.insertOne(klant);
      mailer.sendMail("register");

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
      honden,
      inschrijvingen: [] as KlantInschrijving[],
      reservaties: [] as KlantReservatie[],
      roles: "[]",
      verified: false,
      email: klantData.email.toLowerCase(),
    };
    return klant as Klant;
  },
};

export const { handleRegistration, generateKlant } = registratieHandler;
