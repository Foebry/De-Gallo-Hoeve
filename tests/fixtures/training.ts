import { PriveTrainingCollection } from '@/types/EntityTpes/TrainingType';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import { getCurrentTime } from 'src/shared/functions';

export const createRandomTraining = (): PriveTrainingCollection => {
  const currentTime = getCurrentTime();
  return {
    _id: new ObjectId(),
    naam: 'prive',
    inschrijvingen: [] as ObjectId[],
    bullets: [],
    content: faker.lorem.paragraph(),
    default_content: [],
    image: faker.internet.url(),
    subtitle: faker.datatype.string(),
    prijsExcl: 20.66,
    gratisVerplaatsingBinnen: 10,
    kmHeffing: 0.3,
    created_at: currentTime,
    updated_at: currentTime,
  };
};
