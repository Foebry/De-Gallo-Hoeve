import moment from 'moment';
import { NextApiRequest } from 'next';
import { TRAININGDAY } from 'src/controllers/TrainingDayController';
import { getController } from 'src/services/Factory';

interface HelperInterface {
  capitalize: (string: string) => string;
  createRandomConfirmCode: () => string;
}

export const capitalize = (string: string) => {
  return string
    .split(' ')
    .map(
      (word) => word.substring(0, 1).toUpperCase() + word.substring(1).toLocaleLowerCase()
    )
    .join(' ');
};

export const getCurrentTime = () => {
  const currentMoment = moment().format('YYYY-MM-DD HH:mm:ss');
  return toLocalTime(currentMoment);
};

export const toLocalTime = (date: string): Date => {
  return new Date(moment.utc(date).local().toString());
};

export const createRandomConfirmCode = (length: number = 50) => {
  const options = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const code = new Array(length).fill(0).map((_) => {
    const index = Math.floor(Math.random() * options.length);
    return Math.random() > 0.5 ? options[index].toUpperCase() : options[index];
  });
  return code.join('');
};

export const getAge = (date: Date) =>
  moment(date)
    .fromNow()
    .replace('years ago', 'jaar')
    .replace('a month ago', '1 maand')
    .replace('days ago', 'dagen');

export const toReadableDate = (date: Date): string =>
  date.toISOString().replace('T', ' ').split('.')[0];

export const pick = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const unique = <T>(arr: T[]): T[] => {
  return new Array(...new Set(arr));
};

export const getDomain = (req: NextApiRequest): string | undefined => {
  return req.headers.host;
};

const helper: HelperInterface = {
  createRandomConfirmCode,
  capitalize,
};

export default helper;
