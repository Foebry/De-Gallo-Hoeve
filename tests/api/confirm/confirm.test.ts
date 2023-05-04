import handler from 'src/pages/api/confirm/[code]/index.page';
import { getController } from 'src/services/Factory';
import { getKlantById, KLANT } from 'src/controllers/KlantController';
import { createRandomKlant } from 'tests/fixtures/klant';
import { faker } from '@faker-js/faker';
import { getRequest } from 'tests/helpers';
import { createRandomConfirmCode } from 'src/pages/api/confirm/[code]/repo';
import Mailer from 'src/utils/Mailer';

describe('/confirm', () => {
  const request = getRequest(handler);
  const mockedSendMail = jest.spyOn(Mailer, 'sendMail').mockImplementation();

  describe('/GET', () => {
    it('Should throw ExpiredConfirmCodeError', async () => {
      const randomKlant = createRandomKlant();
      const code = createRandomConfirmCode(randomKlant._id, {
        valid_to: faker.date.past(2),
      });

      await request.get(`/api/confirm/`).query({ code }).expect(307);
    });

    it('Should verify klant and redirect to login', async () => {
      const randomKlant = createRandomKlant();
      const code = createRandomConfirmCode(randomKlant._id);

      await getController(KLANT).save(randomKlant);

      await request.get(`/api/confirm/`).query({ code }).expect(307);

      const verifiedKlant = await getKlantById(randomKlant._id);
      expect(verifiedKlant?.verified).toBe(true);
    });
  });

  describe('/PUT', () => {
    it('should throw klantNotFoundError', async () => {
      const randomKlant = createRandomKlant();
      const code = createRandomConfirmCode(randomKlant._id);

      await request.put(`/api/confirm/`).query({ code }).expect(404);
    });

    it('should throw klantAlreadyVerifiedError', async () => {
      const randomKlant = createRandomKlant({ verified: true });
      const code = createRandomConfirmCode(randomKlant._id);

      await getController(KLANT).save(randomKlant);

      await request.put('/api/confirm/').query({ code }).expect(409);
    });

    it('Should reset confirmCode', async () => {
      const randomKlant = createRandomKlant();
      const code = createRandomConfirmCode(randomKlant._id);

      await getController(KLANT).save(randomKlant);
      const resetTemplateData = expect.objectContaining({
        email: 'sander.fabry@gmail.com',
        vnaam: randomKlant.vnaam,
      });

      await request.put(`/api/confirm/`).query({ code }).expect(200);
      expect(mockedSendMail).toHaveBeenCalledTimes(1);
      expect(mockedSendMail).toHaveBeenCalledWith('resetConfirm', resetTemplateData);
    });
  });
});
