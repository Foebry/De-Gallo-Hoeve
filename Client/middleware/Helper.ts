import { NextApiRequest, NextApiResponse } from "next";
import client, { findOneBy } from "./MongoDb";
import {
  badRequest,
  internalServerError,
  notFound,
} from "../handlers/ResponseHandler";

interface HelperInterface {
  getDisabledDays: (training: string) => Promise<string[]>;
}

const helper: HelperInterface = {
  getDisabledDays: async (training) => {
    const date = new Date();
    const zondag = 0;
    const [woensdag, vrijdag, zaterdag] = [3, 5, 6];
    // vandaag wordt steeds disabled
    const disabledDays = [date.toISOString().split(".")[0].split("T")[0]];

    const temp = new Date();
    const enddate = new Date(temp.setDate(temp.getDate() + 3650));

    while (true) {
      const newDate = new Date(date.setDate(date.getDate() + 1));
      const dateString = newDate.toISOString().split(".")[0].split("T")[0];
      if (training === "groep" && newDate.getDay() !== zondag)
        disabledDays.push(dateString);
      else if (
        training === "prive" &&
        ![woensdag, vrijdag, zaterdag].includes(newDate.getDay())
      )
        disabledDays.push(dateString);
      if (newDate.getTime() > enddate.getTime()) return disabledDays;
    }
  },
};

export const { getDisabledDays } = helper;
