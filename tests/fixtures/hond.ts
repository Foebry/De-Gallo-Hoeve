import { HondCollection } from '@/types/EntityTpes/HondTypes';
import { IsKlantCollection } from '@/types/EntityTpes/KlantTypes';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import { getCurrentTime } from 'src/shared/functions';

export const createRandomHond = (): HondCollection => {
  const now = getCurrentTime();
  return {
    _id: new ObjectId(),
    geslacht: faker.name.gender() === 'male' ? 'Reu' : 'Teef',
    geboortedatum: faker.date.recent(),
    naam: faker.name.firstName(),
    ras: faker.animal.dog(),
    created_at: now,
    updated_at: now,
    deleted_at: undefined,
  };
};

export const createRandomHonden = (amount: number): HondCollection[] => {
  return new Array(amount).fill(0).map(() => createRandomHond());
};
