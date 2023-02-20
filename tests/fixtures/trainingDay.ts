import { ObjectId } from 'mongodb';
import { faker } from '@faker-js/faker';
import { defaultTrainingTimeSlots } from 'src/mappers/trainingDays';
import { TrainingDaysCollection } from '@/types/EntityTpes/TrainingType';
import { getCurrentTime } from 'src/shared/functions';

const createRandomTrainingDay = (): TrainingDaysCollection => ({
  _id: new ObjectId(),
  date: new Date(faker.date.between(getCurrentTime(), faker.date.future(1))),
  timeslots: new Array(faker.datatype.number({ min: 1, max: 8 }))
    .fill(0)
    .map((_, idx) => defaultTrainingTimeSlots[idx]),
  created_at: getCurrentTime(),
  updated_at: getCurrentTime(),
});

export const createRandomTrainingDays = (amount: number) =>
  new Array(amount).fill(0).map(() => createRandomTrainingDay());
