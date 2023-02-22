import { createRandomKlant, RoleOptions } from 'tests/fixtures/klant';
import { getRequest } from 'tests/helpers';
import handler from 'src/pages/api/admin/trainingdays/index.page';
import { createBearer } from 'src/services/Authenticator';
import { getController } from 'src/services/Factory';
import { KLANT } from 'src/controllers/KlantController';
import { clearAllData } from 'src/utils/MongoDb';
import { closeClient } from 'src/utils/db';
import { TRAININGDAY } from 'src/controllers/TrainingDayController';
import { createRandomTrainingDays } from 'tests/fixtures/trainingDay';
import { TrainingDayDto } from '@/types/DtoTypes/TrainingDto';
import { ObjectId } from 'mongodb';
import { getCurrentTime } from 'src/shared/functions';

describe('Admin trainingDays', () => {
  const request = getRequest(handler);

  beforeEach(clearAllData);

  afterAll(async () => {
    await clearAllData();
    await closeClient();
  });

  describe('/ GET', () => {
    it('should return a list of activated TrainingDays', async () => {
      const admin = createRandomKlant({ roles: RoleOptions.ADMIN });
      const bearer = createBearer(admin);
      const trainingDays = createRandomTrainingDays(10);

      await getController(KLANT).save(admin);
      await getController(TRAININGDAY).saveMany(trainingDays);

      const { body } = await request
        .get('/api/admin/trainingdays')
        .auth(bearer, { type: 'bearer' })
        .expect(200);
      expect(body.length).toBe(trainingDays.length);
      expect(body).toEqual(
        expect.arrayContaining(
          trainingDays.map((trainingDay) =>
            expect.objectContaining({
              date: trainingDay.date.toISOString(),
              timeslots: expect.arrayContaining(trainingDay.timeslots),
            })
          )
        )
      );
    });

    it.skip('Should throw UnauthorizedError when not admin', async () => {
      const klant = createRandomKlant();
      const bearer = createBearer(klant);

      await getController(KLANT).save(klant);
      await request
        .get('/api/admin/trainingdays')
        .auth(bearer, { type: 'bearer' })
        .expect(401);
    });
  });

  describe('/ PUT', () => {
    it('Should update activated TrainingDays', async () => {
      const admin = createRandomKlant({ roles: RoleOptions.ADMIN });
      const bearer = createBearer(admin);

      const randomTrainingDays = createRandomTrainingDays(5);
      await getController(KLANT).save(admin);
      await getController(TRAININGDAY).saveMany(randomTrainingDays);

      const payload: { selected: TrainingDayDto[] } = {
        selected: [
          {
            _id: new ObjectId().toString(),
            date: new Date(getCurrentTime().toISOString().split('T')[0]).toISOString(),
            timeslots: ['15:00', '17:00'],
          },
        ],
      };

      const { body } = await request
        .put('/api/admin/trainingdays')
        .auth(bearer, { type: 'bearer' })
        .send(payload)
        .expect(200);
      expect(body).toEqual(payload.selected);
    });

    it('Should throw UnauthorizedError when not admin', async () => {
      const klant = createRandomKlant();
      const bearer = createBearer(klant);

      const payload = {};

      await getController(KLANT).save(klant);
      await request
        .put('/api/admin/trainingdays')
        .auth(bearer, { type: 'bearer' })
        .send(payload)
        .expect(401);
    });
  });
});
