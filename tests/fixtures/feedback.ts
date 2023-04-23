import { IsKlantCollection } from '@/types/EntityTpes/KlantTypes';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import { FeedBackCollection } from 'src/entities/Feedback';
import { getCurrentTime } from 'src/shared/functions';

export const createRandomFeedback = (klant: IsKlantCollection): FeedBackCollection => ({
  _id: new ObjectId(),
  code: `${new Date().getTime().toString(36)}$${klant._id
    .toString()
    .split('')
    .reverse()
    .join('')}`,
  communication: faker.datatype.number({ min: 1, max: 5, precision: 0.5 }),
  created_at: getCurrentTime(),
  happiness: faker.datatype.number({ min: 1, max: 5, precision: 0.5 }),
  helpful: faker.datatype.number({ min: 1, max: 5, precision: 0.5 }),
  name: klant.vnaam,
  recommend: faker.datatype.number({ min: 1, max: 5, precision: 0.5 }),
  updated_at: getCurrentTime(),
  usage: faker.datatype.number({ min: 1, max: 5, precision: 0.5 }),
  missing: faker.datatype.string(),
  overall: faker.datatype.string(),
});
