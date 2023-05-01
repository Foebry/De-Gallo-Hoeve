import { getRequest } from 'tests/helpers';
import handler from 'src/pages/api/contact/index.page';
import { createRandomKlant } from 'tests/fixtures/klant';
import { faker } from '@faker-js/faker';
import Mailer from 'src/utils/Mailer';
import { generateCsrf } from 'src/services/Validator';
import * as repo from 'src/pages/api/logError/repo';
import { closeClient } from 'src/utils/db';

describe('/contact', () => {
  beforeAll(() => {
    faker.setLocale('nl_BE');
  });
  afterAll(async () => {
    jest.clearAllMocks();
    await closeClient();
    faker.setLocale('en_GB');
  });

  beforeEach(() => jest.clearAllMocks());

  const request = getRequest(handler);
  const mockedSendMail = jest.spyOn(Mailer, 'sendMail').mockImplementation();
  const mockedErrorLog = jest.spyOn(repo, 'logError').mockImplementation();

  describe('POST', () => {
    it('Should throw invalidCsrfTokenError when csrf not provided', async () => {
      const { email, vnaam: naam } = createRandomKlant();
      const payload = { email, naam, bericht: faker.datatype.string() };

      await request.post('/api/contact').send(payload).expect(400);

      expect(mockedSendMail).toHaveBeenCalledTimes(0);
      expect(mockedErrorLog).toHaveBeenCalledTimes(1);
    });

    it('Should send email to user and email to admin', async () => {
      const { email, vnaam: naam } = createRandomKlant();
      const payload = {
        email,
        naam,
        gsm: faker.phone.number(),
        bericht: faker.datatype.string(),
        csrf: generateCsrf(),
      };

      await request.post('/api/contact').send(payload).expect(200);

      const contactTemplateData = {
        mailFrom: email,
        naam,
        gsm: payload.gsm,
        bericht: payload.bericht,
        email: 'sander.fabry@gmail.com',
      };
      const contactConfirmTemplateData = {
        email: payload.email,
        naam: payload.naam,
        gsm: payload.gsm,
        bericht: payload.bericht,
      };

      expect(mockedSendMail).toHaveBeenCalledTimes(2);
      expect(mockedSendMail).toHaveBeenCalledWith('contact', contactTemplateData);
      expect(mockedSendMail).toHaveBeenCalledWith(
        'contact-confirm',
        contactConfirmTemplateData
      );
    });
  });
});
