import { ConfirmCollection } from '@/types/EntityTpes/ConfirmTypes';
import { ObjectId } from 'mongodb';
import { InternalServerError, InvalidConfirmCodeFormat } from 'src/shared/RequestError';
import { getConfirmCollection } from 'src/utils/db';

export const createRandomConfirmCode = (klant_id: ObjectId): string => {
  const randomString = new Date().getTime().toString(36);
  const id = klant_id.toString().split('').reverse().join('');

  return [randomString, id].join('$');
};

export const getConfirmByCode = async (
  code: string
): Promise<ConfirmCollection | null> => {
  const collection = await getConfirmCollection();
  return collection.findOne({ code });
};

export const deleteByKlantId = async (klant_id: ObjectId): Promise<void> => {
  const collection = await getConfirmCollection();
  const { deletedCount } = await collection.deleteOne({ klant_id });
  if (deletedCount !== 1) throw new InternalServerError();
};

export const getKlantIdFromConfirmCode = (code: string): [ObjectId, number] => {
  try {
    const [randomString, reversedId] = code.split('$');
    return [
      new ObjectId(reversedId.split('').reverse().join('')),
      parseInt(randomString, 36),
    ];
  } catch (e) {
    throw new InvalidConfirmCodeFormat();
  }
};
