import { createServer, IncomingMessage, RequestListener } from 'http';
import { NextApiHandler } from 'next';
import { apiResolver } from 'next/dist/server/api-utils/node';
import { clearAllData } from 'src/utils/MongoDb';
// import request from 'supertest';
import handler from 'src/pages/api/confirm/[code].page';
import { getController } from 'src/services/Factory';
import { CONFIRM } from 'src/types/EntityTpes/ConfirmTypes';
import { getConfirmByCode } from 'src/controllers/ConfirmController';
import { KLANT } from 'src/controllers/KlantController';
import { createRandomConfirm } from 'tests/fixtures/confirm';
import { createRandomKlant } from 'tests/fixtures/klant';
import { closeClient } from 'src/utils/db';
import { faker } from '@faker-js/faker';
import { getRequest } from 'tests/helpers';

describe('/confirm', () => {
  beforeEach(async () => {
    await clearAllData();
  });
  afterAll(async () => {
    await clearAllData();
    await closeClient();
  });
  const request = getRequest(handler);

  describe('/GET', () => {
    it('Should throw InvalidConfirmCodeError', async () => {
      const randomConfirm = createRandomConfirm();

      const { body } = await request
        .get('/api/confirm/')
        .query({ code: randomConfirm.code })
        .expect(404);

      expect(body).toStrictEqual({ message: 'Code niet gevonden' });
    });

    it('Should throw ExpiredConfirmCodeError', async () => {
      const randomKlant = createRandomKlant();
      const randomConfirm = createRandomConfirm(randomKlant);

      randomConfirm.valid_to = faker.date.past(2);

      await getController(CONFIRM).save(randomConfirm);

      const { body } = await request
        .get(`/api/confirm/`)
        .query({ code: randomConfirm.code })
        .expect(404);

      expect(body).toStrictEqual({
        message: 'Confirm code expired',
      });
    });

    it('Should delete confirmCode and redirect to login', async () => {
      const randomKlant = createRandomKlant();
      const randomConfirm = createRandomConfirm(randomKlant);

      await getController(KLANT).save(randomKlant);
      await getController(CONFIRM).save(randomConfirm);

      await request.get(`/api/confirm/`).query({ code: randomConfirm.code }).expect(307);

      const confirm = await getConfirmByCode(randomConfirm.code);
      expect(confirm).toBeNull();
    });
  });

  describe('/PUT', () => {
    it('should throw InvalidConfirmCodeError', async () => {
      const randomConfirm = createRandomConfirm();

      const response = await request
        .put(`/api/confirm/`)
        .query({ code: randomConfirm.code })
        .expect(404);

      expect(response.body).toStrictEqual({
        message: 'Code niet gevonden',
      });
    });

    it('should throw KlantNotFoundError', async () => {
      const randomConfirm = createRandomConfirm();
      await getController(CONFIRM).save(randomConfirm);

      const response = await request
        .put(`/api/confirm/`)
        .query({ code: randomConfirm.code })
        .expect(404);

      expect(response.body).toStrictEqual({ message: 'Klant niet gevonden' });
    });

    it('Should reset confirmCode', async () => {
      const randomKlant = createRandomKlant();
      const randomConfirm = createRandomConfirm(randomKlant);

      await getController(KLANT).save(randomKlant);
      await getController(CONFIRM).save(randomConfirm);

      const { body } = await request
        .put(`/api/confirm/`)
        .query({ code: randomConfirm.code })
        .expect(200);

      expect(body.code).toBeDefined();
      expect(body.code !== randomConfirm.code).toBe(true);
    });
  });
});
