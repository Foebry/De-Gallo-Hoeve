import { RasCollection } from '@/types/EntityTpes/RasTypes';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import { getCurrentTime } from 'src/shared/functions';

enum RasSoort {
  GROOT = 'groot',
  KLEIN = 'klein',
}

type RasOptions = Partial<{
  naam: string;
  soort: RasSoort;
}>;

export const createRandomRas = (options?: RasOptions): RasCollection => {
  const currentTime = getCurrentTime();
  return {
    _id: new ObjectId(),
    naam: options?.naam ?? faker.animal.dog(),
    created_at: currentTime,
    updated_at: currentTime,
    deleted_at: undefined,
    soort: options?.soort ?? 'groot',
  };
};

export const createRandomRassen = (amount: number): RasCollection[] => {
  return new Array(amount).fill(0).map(() => createRandomRas());
};
