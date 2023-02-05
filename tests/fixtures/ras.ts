import { RasCollection } from '@/types/EntityTpes/RasTypes';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';

enum RasSoort {
  GROOT = 'groot',
  KLEIN = 'klein',
}

type RasOptions = Partial<{
  naam: string;
  soort: RasSoort;
}>;

export const createRandomRas = (options?: RasOptions): RasCollection => {
  return {
    _id: new ObjectId(),
    naam: options?.naam ?? faker.animal.dog(),
    soort: options?.soort ?? 'groot',
  };
};

export const createRandomRassen = (amount: number): RasCollection[] => {
  return new Array(amount).fill(0).map(() => createRandomRas());
};
