import handler from 'src/pages/api/auth/register.page';
import { REGISTERAPI } from 'src/types/apiTypes';
import { getController } from 'src/services/Factory';
import { clearAllData } from 'src/utils/MongoDb';
import { capitalize } from 'src/shared/functions';
import Mailer from 'src/utils/Mailer';
import { createRandomHonden } from 'tests/fixtures/hond';
import {
  createRandomKlant,
  generateRegisterPayloadFromKlantData,
} from 'tests/fixtures/klant';
import { KLANT } from 'src/controllers/KlantController';
import { closeClient } from 'src/utils/db';
import { getRequest } from 'tests/helpers';

describe('/register', () => {
  beforeEach(async () => {
    await clearAllData();
  });
  afterAll(async () => {
    await clearAllData();
    await closeClient();
    jest.clearAllMocks();
  });

  describe('/POST', () => {
    const request = getRequest(handler);
    const mockedSendMail = jest.spyOn(Mailer, 'sendMail');
    mockedSendMail.mockImplementation();

    it('should create new klant', async () => {
      const honden = createRandomHonden(3);
      const klant = createRandomKlant({ honden });

      const payload = generateRegisterPayloadFromKlantData(klant);

      const { body } = await request.post(REGISTERAPI).send(payload).expect(201);
      expect(mockedSendMail).toHaveBeenCalledTimes(2);

      expect(body).toEqual(
        expect.objectContaining({
          roles: '0',
          verified: false,
          inschrijvingen: [],
          reservaties: [],
          email: klant.email,
          vnaam: klant.vnaam,
          lnaam: klant.lnaam,
          gsm: klant.gsm,
          straat: capitalize(klant.straat),
          nr: klant.nr,
          gemeente: capitalize(klant.gemeente),
          postcode: klant.postcode,
          honden: expect.arrayContaining([
            expect.objectContaining({
              naam: klant.honden[0].naam,
              geslacht: klant.honden[0].geslacht,
              ras: klant.honden[0].ras,
            }),
            expect.objectContaining({
              geslacht: klant.honden[1].geslacht,
              naam: klant.honden[1].naam,
              ras: klant.honden[1].ras,
            }),
            expect.objectContaining({
              geslacht: klant.honden[2].geslacht,
              naam: klant.honden[2].naam,
              ras: klant.honden[2].ras,
            }),
          ]),
        })
      );
    });
    it('Should throw EmailOccupiedError', async () => {
      const klant = await getController(KLANT).save(createRandomKlant());
      const newKlant = createRandomKlant();
      newKlant.email = klant.email;
      const payload = generateRegisterPayloadFromKlantData(newKlant);

      const { body } = await request.post(REGISTERAPI).send(payload).expect(422);

      expect(body).toStrictEqual({
        message: 'Kan registratie niet verwerken',
        email: 'Email reeds in gebruik',
      });
    });
  });
  it('Should throw ValidationError', async () => {
    const klant = await getController(KLANT).save(createRandomKlant());
    klant.email = 'test@t';
    const payload = generateRegisterPayloadFromKlantData(klant);

    const { body } = await getRequest(handler)
      .post(REGISTERAPI)
      .send(payload)
      .expect(400);

    expect(body).toStrictEqual({
      email: 'ongeldige email',
      message: 'Registratie niet verwerkt',
    });
  });
});
