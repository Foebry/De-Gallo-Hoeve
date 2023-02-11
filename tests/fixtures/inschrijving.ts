import { HondCollection } from '@/types/EntityTpes/HondTypes';
import { InschrijvingCollection } from '@/types/EntityTpes/InschrijvingTypes';
import { IsKlantCollection } from '@/types/EntityTpes/KlantTypes';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import { getCurrentTime, pick } from 'src/shared/functions';

export const createRandomInschrijving = (
  klant: IsKlantCollection,
  hond: HondCollection
): InschrijvingCollection => {
  const currentTime = getCurrentTime();
  return {
    _id: new ObjectId(),
    datum: faker.date.soon(),
    hond: { id: hond._id, naam: hond.naam },
    klant: { id: klant._id, vnaam: klant.vnaam, lnaam: klant.lnaam },
    training: 'prive',
    created_at: currentTime,
    updated_at: currentTime,
    deleted_at: undefined,
  };
};

export const createRandomInschrijvingen = (
  klant: IsKlantCollection,
  amount: number
): InschrijvingCollection[] => {
  return new Array(amount).fill(0).map(() => {
    const hond = pick(klant.honden);
    return createRandomInschrijving(klant, hond);
  });
};
