import { getRequest } from 'tests/helpers';
import handler from 'src/pages/api/contact/index.page';
import { createRandomKlant } from 'tests/fixtures/klant';
import { faker } from '@faker-js/faker';
import Mailer from 'src/utils/Mailer';

describe('/contact', () => {
  afterAll(() => jest.clearAllMocks());

  const request = getRequest(handler);
  const mockedSendMail = jest.spyOn(Mailer, 'sendMail').mockImplementation();

  describe('POST', () => {
    it('Should send email to user and email to admin', async () => {
      const { email, vnaam: naam } = createRandomKlant();
      const payload = { email, naam, bericht: faker.datatype.string() };

      await request.post('/api/contact').send(payload).expect(200);

      const contactTemplateData = {
        mailFrom: email,
        naam,
        bericht: payload.bericht,
        email: 'sander.fabry@gmail.com',
      };

      expect(mockedSendMail).toHaveBeenCalledTimes(2);
      expect(mockedSendMail).toHaveBeenCalledWith('contact', contactTemplateData);
      expect(mockedSendMail).toHaveBeenCalledWith('contact-confirm', payload);
    });
  });
});
