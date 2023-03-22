import { ConfirmCollection } from '@/types/EntityTpes/ConfirmTypes';
import { ObjectId } from 'mongodb';
import { InternalServerError, InvalidConfirmCodeFormat } from 'src/shared/RequestError';
import { getConfirmCollection } from 'src/utils/db';

type ConfirmCodeOptions = { valid_to: Date };

export const createRandomConfirmCode = (
  klant_id: ObjectId,
  options?: ConfirmCodeOptions
): string => {
  const date = options?.valid_to ?? new Date();
  const valid_to = date.getTime() + 3600000;
  const timeString = valid_to.toString(36);
  const id = klant_id.toString().split('').reverse().join('');

  return [timeString, id].join('$');
};

export const getIdAndExpirationTimeFromCode = (code: string): [ObjectId, number] => {
  try {
    console.log({ code });
    const [randomString, reversedId] = code.split('$');
    return [
      new ObjectId(reversedId.split('').reverse().join('')),
      parseInt(randomString, 36),
    ];
  } catch (e) {
    console.log({ e });
    throw new InvalidConfirmCodeFormat();
  }
};
