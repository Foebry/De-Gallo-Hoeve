import { LOGINAPI } from 'src/types/apiTypes';
import { generateCsrf } from 'src/services/Validator';
import handler from 'src/pages/api/auth/login.page';
import { getController } from 'src/services/Factory';
import { KLANT } from 'src/controllers/KlantController';
import { createRandomKlant } from 'tests/fixtures/klant';
import bcrypt from 'bcrypt';
import { getRequest } from 'tests/helpers';

describe('login', () => {
  const request = getRequest(handler);

  it('login without csrf should result in bad request', async () => {
    const loginPayload = {
      email: 'rain_fabry@hotmail.com',
      password: 'password',
    };

    const { body } = await request.post(LOGINAPI).send(loginPayload).expect(400);

    expect(body).toStrictEqual({
      message: 'Er is iets fout gegaan, probeer later opnieuw...',
      code: 400,
      errorCode: 'InvalidCsrfError',
    });
  });
  it('login with wrong email should throw InvalidEmailError', async () => {
    const loginPayload = {
      csrf: generateCsrf(),
      email: 'rain_fabry@hotmail.com',
      password: 'password',
    };
    const { body } = await request.post(LOGINAPI).send(loginPayload).expect(422);

    expect(body).toStrictEqual({
      email: 'Onbekende email',
      message: 'Kan verzoek niet verwerken',
      code: 422,
      errorCode: 'UnrecognizedEmailError',
    });
  });
  it('Login with wrong password should throw InvalidPasswordError', async () => {
    const klant = await getController(KLANT).save(createRandomKlant());
    const loginPayload = {
      csrf: generateCsrf(),
      email: klant.email,
      password: 'abc',
    };
    const { body } = await request.post(LOGINAPI).send(loginPayload).expect(422);

    expect(body).toStrictEqual({
      password: 'Ongeldig wachtwoord',
      message: 'Kan verzoek niet verwerken',
      code: 422,
      errorCode: 'InvalidPasswordError',
    });
  });
  it('Login with correct credentials should create jwt token and frontend token', async () => {
    const klant = createRandomKlant();
    const password = klant.password;
    klant.password = await bcrypt.hash(password, 10);

    await getController(KLANT).save(klant);

    const loginPayload = {
      csrf: generateCsrf(),
      email: klant.email,
      password: password,
    };

    const response = await request.post(LOGINAPI).send(loginPayload).expect(200);

    expect(Object.keys(response.headers['set-cookie']).includes('JWT'));
    expect(response.headers['set-cookie'].includes('Client'));
  });
});
