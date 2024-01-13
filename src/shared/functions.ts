import moment from 'moment';
import { NextApiRequest } from 'next';

interface HelperInterface {
  capitalize: (string: string) => string;
}

export const capitalize = (string: string) => {
  return string
    .split(' ')
    .map((word) => word.substring(0, 1).toUpperCase() + word.substring(1).toLocaleLowerCase())
    .join(' ');
};

export const getCurrentTime = () => {
  const currentMoment = moment().format('YYYY-MM-DD HH:mm:ss');
  return toLocalTime(currentMoment);
};

export const toLocalTime = (date: string): Date => {
  return new Date(moment.utc(date).local().toString());
};

export const getAge = (date: Date) =>
  moment(date).fromNow().replace('years ago', 'jaar').replace('a month ago', '1 maand').replace('days ago', 'dagen');

export const toReadableDate = (date: Date): string => date.toISOString().replace('T', ' ').split('.')[0];
export const toHumanReadableDate = (date: Date): string =>
  date.toLocaleDateString('nl-BE', { year: 'numeric', month: 'long', day: 'numeric' });

export const pick = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const unique = <T>(arr: T[]): T[] => {
  return new Array(...new Set(arr));
};

export const getDomain = (req: NextApiRequest): string | undefined => {
  return req.headers.host?.includes('localhost') ? 'de-gallo-hoeve-git-develop-foebry.vercel.app' : req.headers.host;
};

export enum FrontEndErrorCodes {
  KlantNotFound = 'rwm3hf15rcd',
  KlantAlreadyVerified = 'k1r5c6vgirp',
  ExpiredConfirmCode = 'e7turmpp5tn',
}

export const sleep = async (s: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve(true);
    }, s * 1000);
  });
};

export const notEmpty = <T>(obj: T | null | undefined): obj is T => {
  return obj !== null && obj !== undefined;
};

export const classNames = (classes: Record<string, boolean>) => {
  return Object.entries(classes)
    .map(([className, check]) => (check ? className : undefined))
    .filter(notEmpty)
    .join(' ');
};

export const getDatesBetween = (startDate: Date, endDate: Date) => {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const newDate = new Date(currentDate);
    dates.push(newDate);
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }
  return dates;
};

export const getDayNameFromDate = (date: Date) => {
  const weekdayMapper: Record<string, string> = {
    '1': 'Maa',
    '2': 'Di',
    '3': 'Woe',
    '4': 'Do',
    '5': 'Vrij',
    '6': 'Za',
    '0': 'Zo',
  };
  return weekdayMapper[date.getDay()];
};

const helper: HelperInterface = {
  capitalize,
};

export default helper;
