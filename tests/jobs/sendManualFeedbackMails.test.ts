import { INSCHRIJVING } from 'src/controllers/InschrijvingController';
import { KLANT } from 'src/controllers/KlantController';
import { getController } from 'src/services/Factory';
import { closeClient } from 'src/utils/db';
import { clearAllData } from 'src/utils/MongoDb';
import { createRandomHond } from 'tests/fixtures/hond';
import { createRandomInschrijvingen } from 'tests/fixtures/inschrijving';
import { createRandomKlant, RoleOptions } from 'tests/fixtures/klant';
import handler from 'src/pages/api/cron/sendManualFeedbackMails/index.page';
import { getRequest } from 'tests/helpers';
import mailer from 'src/utils/Mailer';
import { faker } from '@faker-js/faker';
import { createBearer } from 'src/services/Authenticator';
import moment from 'moment';

describe('JOB - sendFeedbackMails', () => {
  const request = getRequest(handler);
  const mailMock = jest.spyOn(mailer, 'sendMail').mockImplementation();
  beforeAll(async () => clearAllData());

  afterEach(async () => clearAllData());

  afterAll(async () => {
    await clearAllData();
    await closeClient();
  });

  it('Should throw 401 when not adminRequest', async () => {
    const klant = createRandomKlant();
    const bearer = createBearer(klant);

    await request
      .get('/api/cron/sendManualFeedbackMails')
      .auth(bearer, { type: 'bearer' })
      .send()
      .expect(401);
  });

  it('Should send email if customer feedbackConfiguration setting has been breached', async () => {
    const inschrijivingController = getController(INSCHRIJVING);
    const klantController = getController(KLANT);

    const admin = createRandomKlant({ roles: RoleOptions.ADMIN });
    const bearer = createBearer(admin);

    const klantTrainingCount1 = createRandomKlant({
      verified: true,
      honden: [createRandomHond()],
    });
    const klantTrainingCount5 = createRandomKlant({
      verified: true,
      honden: [createRandomHond()],
    });
    const klantTrainingCount10 = createRandomKlant({
      verified: true,
      honden: [createRandomHond()],
    });
    const klantTrainingCount20 = createRandomKlant({
      verified: true,
      honden: [createRandomHond()],
    });
    const klantTrainingCount49 = createRandomKlant({
      verified: true,
      honden: [createRandomHond()],
    });
    const klantTrainingCount100 = createRandomKlant({
      verified: true,
      honden: [createRandomHond()],
    });
    const klantWithoutInschrijvingen = createRandomKlant({
      verified: true,
      honden: [createRandomHond()],
    });
    const klantWithOneInschrijvingInFuture = createRandomKlant({
      verified: true,
      honden: [createRandomHond()],
    });
    const allKlanten = [
      admin,
      klantTrainingCount1,
      klantTrainingCount5,
      klantTrainingCount10,
      klantTrainingCount20,
      klantTrainingCount49,
      klantTrainingCount100,
      klantWithoutInschrijvingen,
      klantWithOneInschrijvingInFuture,
    ];

    const trainingenKlantA = createRandomInschrijvingen(klantTrainingCount1, 1);
    const trainingenKlantB = createRandomInschrijvingen(klantTrainingCount5, 5);
    const trainingenKlantC = createRandomInschrijvingen(klantTrainingCount10, 10);
    const trainingenKlantD = createRandomInschrijvingen(klantTrainingCount20, 20);
    const trainingenKlantE = createRandomInschrijvingen(klantTrainingCount49, 49);
    const trainingenKlantF = createRandomInschrijvingen(klantTrainingCount100, 100);
    const allInschrijvingen = [
      ...trainingenKlantA,
      ...trainingenKlantB,
      ...trainingenKlantC,
      ...trainingenKlantD,
      ...trainingenKlantE,
      ...trainingenKlantF,
    ].map((inschrijving) => ({
      ...inschrijving,
      datum: moment()
        .subtract(faker.datatype.number({ min: 5, max: 365 }), 'days')
        .toDate(),
    }));
    const trainingenKlantG = createRandomInschrijvingen(
      klantWithOneInschrijvingInFuture,
      1
    );

    klantWithOneInschrijvingInFuture.inschrijvingen = trainingenKlantG.map(
      (inschrijving) => inschrijving._id
    );
    klantTrainingCount1.inschrijvingen = trainingenKlantA.map(
      (inschrijving) => inschrijving._id
    );
    klantTrainingCount5.inschrijvingen = trainingenKlantB.map(
      (inschrijving) => inschrijving._id
    );
    klantTrainingCount10.inschrijvingen = trainingenKlantC.map(
      (inschrijving) => inschrijving._id
    );
    klantTrainingCount20.inschrijvingen = trainingenKlantD.map(
      (inschrijving) => inschrijving._id
    );
    klantTrainingCount49.inschrijvingen = trainingenKlantE.map(
      (inschrijving) => inschrijving._id
    );
    klantTrainingCount100.inschrijvingen = trainingenKlantF.map(
      (inschrijving) => inschrijving._id
    );

    await inschrijivingController.saveMany([...allInschrijvingen, ...trainingenKlantG]);
    await klantController.saveMany(allKlanten);

    const { body } = await request
      .get('/api/cron/sendManualFeedbackMails')
      .auth(bearer, { type: 'bearer' })
      .send();
    expect(body).toEqual({ success: true });
    expect(mailMock).toHaveBeenCalledTimes(6);
    expect(mailMock).toHaveBeenCalledWith(
      'customerFeedback',
      expect.objectContaining({
        email: klantTrainingCount1.email,
        vnaam: klantTrainingCount1.vnaam,
        amount: 1,
      })
    );
    expect(mailMock).toHaveBeenCalledWith(
      'customerFeedback',
      expect.objectContaining({
        email: klantTrainingCount5.email,
        vnaam: klantTrainingCount5.vnaam,
        amount: 5,
      })
    );
    expect(mailMock).toHaveBeenCalledWith(
      'customerFeedback',
      expect.objectContaining({
        email: klantTrainingCount10.email,
        vnaam: klantTrainingCount10.vnaam,
        amount: 10,
      })
    );
    expect(mailMock).toHaveBeenCalledWith(
      'customerFeedback',
      expect.objectContaining({
        email: klantTrainingCount20.email,
        vnaam: klantTrainingCount20.vnaam,
        amount: 20,
      })
    );
    expect(mailMock).toHaveBeenCalledWith(
      'customerFeedback',
      expect.objectContaining({
        email: klantTrainingCount49.email,
        vnaam: klantTrainingCount49.vnaam,
        amount: 20,
      })
    );
    expect(mailMock).toHaveBeenCalledWith(
      'customerFeedback',
      expect.objectContaining({
        email: klantTrainingCount100.email,
        vnaam: klantTrainingCount100.vnaam,
        amount: 100,
      })
    );
    const updatedKlanten = await klantController.getAllKlanten();
    expect(updatedKlanten).toEqual(
      updatedKlanten.map((klant) =>
        expect.objectContaining({
          feedbackConfiguration: expect.arrayContaining(
            klant.feedbackConfiguration.map((setting) =>
              expect.objectContaining({
                trainingCount: setting.trainingCount,
                triggered:
                  setting.trainingCount === 1 &&
                  ![
                    admin._id.toString(),
                    klantWithoutInschrijvingen._id.toString(),
                    klantWithOneInschrijvingInFuture._id.toString(),
                  ].includes(klant._id.toString())
                    ? true
                    : setting.trainingCount === 5 &&
                      ![
                        admin._id.toString(),
                        klantWithoutInschrijvingen._id.toString(),
                        klantWithOneInschrijvingInFuture._id.toString(),
                        klantTrainingCount1._id.toString(),
                      ].includes(klant._id.toString())
                    ? true
                    : setting.trainingCount === 10 &&
                      ![
                        admin._id.toString(),
                        klantWithoutInschrijvingen._id.toString(),
                        klantWithOneInschrijvingInFuture._id.toString(),
                        klantTrainingCount1._id.toString(),
                        klantTrainingCount5._id.toString(),
                      ].includes(klant._id.toString())
                    ? true
                    : setting.trainingCount === 20 &&
                      ![
                        admin._id.toString(),
                        klantWithoutInschrijvingen._id.toString(),
                        klantWithOneInschrijvingInFuture._id.toString(),
                        klantTrainingCount1._id.toString(),
                        klantTrainingCount5._id.toString(),
                        klantTrainingCount10._id.toString(),
                      ].includes(klant._id.toString())
                    ? true
                    : setting.trainingCount === 50 &&
                      [klantTrainingCount100._id.toString()].includes(
                        klant._id.toString()
                      )
                    ? true
                    : setting.trainingCount === 100 &&
                      klantTrainingCount100._id.toString() === klant._id.toString()
                    ? true
                    : false,
              })
            )
          ),
        })
      )
    );
  });
});
