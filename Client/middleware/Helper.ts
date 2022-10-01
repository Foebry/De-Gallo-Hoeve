import { getTrainingDaysCollection } from "../controllers/TrainingController";
import { TrainingDaysCollection } from "../types/EntityTpes/TrainingType";
import client, { MongoDb } from "./MongoDb";

interface HelperInterface {
  getDisabledDays: (training: string) => Promise<string[]>;
  capitalize: (string: string) => string;
  createRandomConfirmCode: () => string;
}

const helper: HelperInterface = {
  getDisabledDays: async (training) => {
    const date = new Date();

    // vandaag wordt steeds disabled
    const disabledDays = [date.toISOString().split(".")[0].split("T")[0]];

    const temp = new Date();
    const enddate = new Date(temp.getFullYear(), temp.getMonth() + 2, 0);
    const trainingDays = (await getTrainingDaysCollection()
      .find({
        date: { $gt: new Date(temp) },
      })
      .toArray()) as TrainingDaysCollection[];

    const enabledDays = trainingDays.map((el) => el.date.toISOString());

    while (true) {
      const newDate = new Date(date.setDate(date.getDate() + 1));
      const dateString = newDate.toISOString().split(".")[0].split("T")[0];

      if (!enabledDays.includes(new Date(dateString).toISOString())) {
        disabledDays.push(dateString);
      }

      if (newDate.getTime() > enddate.getTime()) return disabledDays;
    }
  },
  capitalize: (string) => {
    const words = string.split(" ");
    return words
      .map(
        (word) =>
          word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase()
      )
      .join(" ");
  },
  createRandomConfirmCode: (length: number = 50) => {
    const options = "abcdefghijklmnopqrstuvwxyz0123456789";
    const code = new Array(length).fill(0).map((_) => {
      const index = Math.floor(Math.random() * options.length);
      return Math.random() > 0.5
        ? options[index].toUpperCase()
        : options[index];
    });
    return code.join("");
  },
};

export const { getDisabledDays, capitalize, createRandomConfirmCode } = helper;
