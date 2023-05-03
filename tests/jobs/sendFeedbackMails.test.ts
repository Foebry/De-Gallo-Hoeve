import moment from 'moment';
import { INSCHRIJVING } from 'src/controllers/InschrijvingController';
import { KLANT } from 'src/controllers/KlantController';
import { getController } from 'src/services/Factory';
import { createRandomHond } from 'tests/fixtures/hond';
import { createRandomInschrijvingen } from 'tests/fixtures/inschrijving';
import { createRandomKlant } from 'tests/fixtures/klant';
import handler from 'src/pages/api/cron/sendFeedbackMails/index.page';
import { getRequest } from 'tests/helpers';
import mailer from 'src/utils/Mailer';
import logger from 'src/utils/logger';

describe('JOB - sendFeedbackMails', () => {
  const request = getRequest(handler);
  jest.spyOn(logger, 'info').mockImplementation();
  const mailMock = jest.spyOn(mailer, 'sendMail').mockImplementation();

  afterEach(jest.clearAllMocks);

  it('Should throw 403 when invalid security-key', async () => {
    await request.get('/api/cron/sendFeedbackMails').send().expect(403);
  });

  it('Should send email if customer had a training yesterday and a new breakpoint has been breached', async () => {
    const inschrijivingController = getController(INSCHRIJVING);
    const klantController = getController(KLANT);

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
    const klantTrainingCount50 = createRandomKlant({
      verified: true,
      honden: [createRandomHond()],
    });
    const klantTrainingCount100 = createRandomKlant({
      verified: true,
      honden: [createRandomHond()],
    });
    const allKlanten = [
      klantTrainingCount1,
      klantTrainingCount5,
      klantTrainingCount10,
      klantTrainingCount20,
      klantTrainingCount50,
      klantTrainingCount100,
    ];

    const trainingenKlantA = createRandomInschrijvingen(klantTrainingCount1, 2);
    const trainingenKlantB = createRandomInschrijvingen(klantTrainingCount5, 6);
    const trainingenKlantC = createRandomInschrijvingen(klantTrainingCount10, 11);
    const trainingenKlantD = createRandomInschrijvingen(klantTrainingCount20, 21);
    const trainingenKlantE = createRandomInschrijvingen(klantTrainingCount50, 51);
    const trainingenKlantF = createRandomInschrijvingen(klantTrainingCount100, 101);
    const allInschrijvingen = [
      ...trainingenKlantA,
      ...trainingenKlantB,
      ...trainingenKlantC,
      ...trainingenKlantD,
      ...trainingenKlantE,
      ...trainingenKlantF,
    ];

    trainingenKlantA[0].datum = moment().subtract(1, 'day').toDate();
    trainingenKlantB[0].datum = moment().subtract(1, 'day').toDate();
    trainingenKlantC[0].datum = moment().subtract(1, 'day').toDate();
    trainingenKlantD[0].datum = moment().subtract(1, 'day').toDate();
    trainingenKlantE[0].datum = moment().subtract(1, 'day').toDate();
    trainingenKlantF[0].datum = moment().subtract(1, 'day').toDate();

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
    klantTrainingCount50.inschrijvingen = trainingenKlantE.map(
      (inschrijving) => inschrijving._id
    );
    klantTrainingCount100.inschrijvingen = trainingenKlantF.map(
      (inschrijving) => inschrijving._id
    );

    klantTrainingCount5.feedbackConfiguration =
      klantTrainingCount5.feedbackConfiguration.map((setting) =>
        setting.trainingCount === 1 ? { ...setting, triggered: true } : setting
      );
    klantTrainingCount10.feedbackConfiguration =
      klantTrainingCount10.feedbackConfiguration.map((setting) =>
        [1, 5].includes(setting.trainingCount) ? { ...setting, triggered: true } : setting
      );
    klantTrainingCount20.feedbackConfiguration =
      klantTrainingCount20.feedbackConfiguration.map((setting) =>
        [1, 5, 10].includes(setting.trainingCount)
          ? { ...setting, triggered: true }
          : setting
      );
    klantTrainingCount50.feedbackConfiguration =
      klantTrainingCount50.feedbackConfiguration.map((setting) =>
        [1, 5, 10, 20].includes(setting.trainingCount)
          ? { ...setting, triggered: true }
          : setting
      );
    klantTrainingCount100.feedbackConfiguration =
      klantTrainingCount100.feedbackConfiguration.map((setting) =>
        [1, 5, 10, 20, 50].includes(setting.trainingCount)
          ? { ...setting, triggered: true }
          : setting
      );

    await inschrijivingController.saveMany(allInschrijvingen);
    await klantController.saveMany(allKlanten);

    const klantenToReceiveEmail = [
      klantTrainingCount1,
      klantTrainingCount5,
      klantTrainingCount10,
      klantTrainingCount20,
      klantTrainingCount50,
      klantTrainingCount100,
    ];

    const { body } = await request
      .get('/api/cron/sendFeedbackMails')
      .query({ key: process.env.CRON_FEEDBACK_EMAIL_KEY })
      .send()
      .expect(200);
    expect(body).toEqual({ success: true });
    expect(mailMock).toHaveBeenCalledTimes(klantenToReceiveEmail.length);
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
        email: klantTrainingCount50.email,
        vnaam: klantTrainingCount50.vnaam,
        amount: 50,
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
                  setting.trainingCount === 1
                    ? true
                    : setting.trainingCount === 5 &&
                      klant._id.toString() !== klantTrainingCount1._id.toString()
                    ? true
                    : setting.trainingCount === 10 &&
                      ![
                        klantTrainingCount1._id.toString(),
                        klantTrainingCount5._id.toString(),
                      ].includes(klant._id.toString())
                    ? true
                    : setting.trainingCount === 20 &&
                      ![
                        klantTrainingCount1._id.toString(),
                        klantTrainingCount5._id.toString(),
                        klantTrainingCount10._id.toString(),
                      ].includes(klant._id.toString())
                    ? true
                    : setting.trainingCount === 50 &&
                      [
                        klantTrainingCount50._id.toString(),
                        klantTrainingCount100._id.toString(),
                      ].includes(klant._id.toString())
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
