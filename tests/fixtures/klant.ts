import { HondCollection } from '@/types/EntityTpes/HondTypes';
import { faker } from '@faker-js/faker';
import moment from 'moment';
import { ObjectId } from 'mongodb';
import { IsKlantCollection } from 'src/common/domain/klant';
import { getKlantByEmail } from 'src/controllers/KlantController';
import { createDefaultFeedbackConfiguration } from 'src/services/Factory';
import { generateCsrf } from 'src/services/Validator';
import { capitalize, getCurrentTime } from 'src/shared/functions';

export enum RoleOptions {
  USER = '0',
  ADMIN = '1',
  SUPER_ADMIN = '2',
}

type RandomKlantOptions = Partial<{
  roles: RoleOptions;
  verified: boolean;
  honden: HondCollection[];
}>;

export const createRandomKlant = (options?: RandomKlantOptions): IsKlantCollection => {
  const now = getCurrentTime();
  return {
    _id: new ObjectId(),
    roles: options?.roles ?? RoleOptions.USER,
    verified: options?.verified ?? false,
    inschrijvingen: [],
    reservaties: [],
    honden: options?.honden ?? [],
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password() + '1A&',
    vnaam: capitalize(faker.name.firstName()),
    lnaam: capitalize(faker.name.lastName()),
    gsm: faker.phone.number('04########'),
    straat: capitalize(faker.address.street()),
    nr: parseInt(faker.address.buildingNumber()),
    bus: Math.random() > 0.8 ? faker.datatype.string(1) : undefined,
    gemeente: capitalize(faker.address.cityName()),
    postcode: parseInt(faker.address.zipCode('####')),
    created_at: now,
    updated_at: now,
    verified_at: options?.verified
      ? faker.date.between(now, moment(now).add(10, 'days').toDate())
      : undefined,
    deleted_at: undefined,
    feedbackConfiguration: createDefaultFeedbackConfiguration(),
  };
};

export const generateRegisterPayloadFromKlantData = (klant: IsKlantCollection) => ({
  vnaam: klant.vnaam,
  lnaam: klant.lnaam,
  email: klant.email,
  straat: klant.straat,
  nr: klant.nr,
  bus: klant.bus,
  gemeente: klant.gemeente,
  postcode: klant.postcode,
  gsm: klant.gsm,
  password: klant.password,
  honden: klant.honden.map((hond) => ({
    naam: hond.naam,
    geslacht: hond.geslacht,
    ras: hond.ras,
    geboortedatum: hond.geboortedatum,
  })),
  feedbackConfiguration: klant.feedbackConfiguration,
  csrf: generateCsrf(),
});

export const createRandomKlanten = (amount: number): IsKlantCollection[] => {
  return new Array(amount).fill(0).map(() => createRandomKlant());
};
