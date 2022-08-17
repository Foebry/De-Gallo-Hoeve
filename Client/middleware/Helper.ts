import { NextApiRequest, NextApiResponse } from "next";
import { findOneBy, kanInschrijvenTraining } from "./MongoDb";
import {
  badRequest,
  internalServerError,
  notFound,
} from "../handlers/ResponseHandler";

interface HelperInterface {
  processInschrijving: (obj: {
    req: NextApiRequest;
    res: NextApiResponse;
  }) => Promise<void>;
  getDisabledDays: (training: string) => Promise<string[]>;
}

const helper: HelperInterface = {
  processInschrijving: async ({ req, res }) => {
    const { training_id, klant_id, hond_id, datum } = req.body;
    const klant = findOneBy("klant", { _id: klant_id });
    const training = findOneBy("training", { _id: training_id });
    const hond = findOneBy("hond", { _id: hond_id });

    if (!klant) return notFound(res, "Klant niet gevonden");
    if (!training) return notFound(res, "training niet gevonden");
    if (!hond) return notFound(res, "hond niet gevonden");

    //controleer of training nog plaatsen vrij heeft
    const kanInschrijven = await kanInschrijvenTraining(training_id, datum);
    if (kanInschrijven === null) return internalServerError(res);
    if (kanInschrijven === false) return badRequest(res, "training volzet");

    //controleer klant heeft zich nog niet ingeschreven voor deze training
  },

  getDisabledDays: async (training) => {
    const date = new Date();
    const disabledDays = [date.toISOString().split(".")[0].split("T")[0]];
    const temp = new Date();
    const enddate = new Date(temp.setDate(temp.getDate() + 3650));
    while (true) {
      const newDate = new Date(date.setDate(date.getDate() + 1));
      const dateString = newDate.toISOString().split(".")[0].split("T")[0];
      if (training === "groep" && newDate.getDay() !== 0)
        disabledDays.push(dateString);
      else if (training === "prive" && ![3, 5, 6].includes(newDate.getDay()))
        disabledDays.push(dateString);
      if (newDate.getTime() > enddate.getTime()) return disabledDays;
    }
  },
};

export const { processInschrijving, getDisabledDays } = helper;
