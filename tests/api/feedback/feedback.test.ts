import { getRequest } from 'tests/helpers';
import handler from 'src/pages/api/feedback/index.page';
import { createRandomKlant } from 'tests/fixtures/klant';
import { getController } from 'src/services/Factory';
import { KLANT } from 'src/controllers/KlantController';
import { getFeedbackById, saveFeedback } from 'src/pages/api/feedback/repo';
import { createRandomFeedback } from 'tests/fixtures/feedback';
import { getRating } from 'src/entities/Feedback';
import { clearAllData } from 'src/utils/MongoDb';
import { closeClient } from 'src/utils/db';
import { createBearer } from 'src/services/Authenticator';
import { FeedbackBody } from 'src/pages/api/feedback/schemas';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import { getCurrentTime, toLocalTime } from 'src/shared/functions';
import moment from 'moment';

describe('/', () => {
  const request = getRequest(handler);

  beforeEach(clearAllData);
  afterAll(async () => {
    await clearAllData();
    await closeClient();
  });

  describe('GET', () => {
    it('Should return a list of feedback dtos', async () => {
      const randomKlant = await getController(KLANT).save(createRandomKlant());
      const randomKlant2 = await getController(KLANT).save(createRandomKlant());
      const randomFeedbackKlant1 = createRandomFeedback(randomKlant);
      const randomFeedbackKlant2 = createRandomFeedback(randomKlant2);

      await saveFeedback(randomFeedbackKlant1);
      await saveFeedback(randomFeedbackKlant2);

      const { body } = await request.get('/api/feedback').expect(200);
      expect(body).toHaveLength(2);
      expect(body).toEqual(
        expect.arrayContaining([
          {
            id: randomFeedbackKlant1._id.toString(),
            rating: getRating(randomFeedbackKlant1),
            feedback: randomFeedbackKlant1.overall,
            name: randomFeedbackKlant1.name,
          },
          {
            id: randomFeedbackKlant2._id.toString(),
            rating: getRating(randomFeedbackKlant2),
            feedback: randomFeedbackKlant2.overall,
            name: randomFeedbackKlant2.name,
          },
        ])
      );
    });
  });

  describe('POST', () => {
    it('Should create a new feedback', async () => {
      const klant = createRandomKlant({ verified: true });
      const bearer = createBearer(klant);

      await getController(KLANT).save(klant);

      const expiration = toLocalTime(
        moment(getCurrentTime().toISOString()).add(1, 'month').toString()
      );
      const feedbackCode = [
        `${expiration.getTime().toString(36)}`,
        klant._id.toString().split('').reverse().join(''),
      ].join('$');

      const payload: FeedbackBody = {
        happiness: faker.datatype.number({ min: 1, max: 5 }),
        communication: faker.datatype.number({ min: 1, max: 5 }),
        helpful: faker.datatype.number({ min: 1, max: 5 }),
        recommend: faker.datatype.number({ min: 1, max: 5 }),
        usage: faker.datatype.number({ min: 1, max: 5 }),
        missing: faker.datatype.string(100),
        overall: faker.datatype.string(100),
      };

      const { body } = await request
        .post('/api/feedback')
        .auth(bearer, { type: 'bearer' })
        .send(payload)
        .query({ code: feedbackCode })
        .expect(201);

      expect(body).toEqual(expect.objectContaining({ ...payload }));

      const savedFeedback = await getFeedbackById(new ObjectId(body._id));
      expect(savedFeedback).toBeDefined();
    });
  });
});
