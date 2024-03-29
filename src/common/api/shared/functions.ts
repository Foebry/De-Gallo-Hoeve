import moment from 'moment';
import { NextApiRequest } from 'next';

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

export enum FrontEndErrorCodes {
  KlantNotFound = 'rwm3hf15rcd',
  KlantAlreadyVerified = 'k1r5c6vgirp',
  ExpiredConfirmCode = 'e7turmpp5tn',
}
