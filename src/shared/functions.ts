import moment from "moment";
import { getTrainingDaysCollection } from "src/utils/db";
import { TrainingDaysCollection } from "../types/EntityTpes/TrainingType";

interface HelperInterface {
  getDisabledDays: (training: string) => Promise<string[]>;
  capitalize: (string: string) => string;
  createRandomConfirmCode: () => string;
}

export const getDisabledDays = async (traning: string) => {
  const trainingDaysCollection = await getTrainingDaysCollection();
  const date = new Date();

  //today is always disabled to prevent any new inschrijvingen or reservations for the current day
  const disabledDays = [date.toISOString().split(".")[0].split("T")[0]];

  const temp = new Date();
  const endDate = new Date(temp.getFullYear(), temp.getMonth() + 2, 0);
  const trainingDays = (await trainingDaysCollection
    .find({ date: { $gt: new Date(temp) } })
    .toArray()) as TrainingDaysCollection[];

  const enabledDays = trainingDays.map((day) => day.date.toISOString());

  while (true) {
    const newDate = new Date(date.setDate(date.getDate() + 1));
    const dateString = newDate.toISOString().split(".")[0].split("T")[0];

    if (!enabledDays.includes(new Date(dateString).toISOString())) {
      disabledDays.push(dateString);
    }
    if (newDate.getTime() > endDate.getTime()) return disabledDays;
  }
};

export const capitalize = (string: string) => {
  return string
    .split(" ")
    .map(
      (word) =>
        word.substring(0, 1).toUpperCase() +
        word.substring(1).toLocaleLowerCase()
    )
    .join(" ");
};

export const getCurrentTime = () => {
  const currentMoment = moment().format("YYYY-MM-DD HH:mm:ss");
  return toLocalTime(currentMoment);
};

export const toLocalTime = (date: string): Date => {
  return new Date(moment.utc(date).local().toString());
};

export const createRandomConfirmCode = (length: number = 50) => {
  const options = "abcdefghijklmnopqrstuvwxyz0123456789";
  const code = new Array(length).fill(0).map((_) => {
    const index = Math.floor(Math.random() * options.length);
    return Math.random() > 0.5 ? options[index].toUpperCase() : options[index];
  });
  return code.join("");
};

const helper: HelperInterface = {
  createRandomConfirmCode,
  capitalize,
  getDisabledDays,
};

export default helper;
