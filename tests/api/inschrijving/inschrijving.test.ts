import { createServer, IncomingMessage, RequestListener } from 'http';
import { NextApiHandler } from 'next';
import request from 'supertest';
import { apiResolver } from 'next/dist/server/api-utils/node';
import { clearAllData } from 'src/utils/MongoDb';
import { POST_INSCHRIJVING } from 'src/types/apiTypes';
import handler from 'src/pages/api/inschrijvingen.page';
import { getController } from 'src/services/Factory';
import { generateCsrf } from 'src/services/Validator';
import { createBearer } from 'src/services/Authenticator';
import { ObjectId } from 'mongodb';
import moment from 'moment';
import Mailer from '../../../src/utils/Mailer';
import { KLANT } from 'src/controllers/KlantController';
import { TRAINING } from 'src/controllers/TrainingController';
import { INSCHRIJVING } from 'src/controllers/InschrijvingController';
import { createRandomHond, createRandomHonden } from 'tests/fixtures/hond';
import { createRandomKlant } from 'tests/fixtures/klant';
import { createRandomTraining } from 'tests/fixtures/training';
import {
  createRandomInschrijving,
  createRandomInschrijvingen,
} from 'tests/fixtures/inschrijving';
import { closeClient } from 'src/utils/db';
import { getRequest } from 'tests/helpers';
import logger from 'src/utils/logger';
import { createRandomTrainingDays } from 'tests/fixtures/trainingDay';
import { defaultTrainingTimeSlots } from 'src/mappers/trainingDays';
import { TRAININGDAY } from 'src/controllers/TrainingDayController';
import { TrainingDayDto } from '@/types/DtoTypes/TrainingDto';
import {
  getCurrentTime,
  toLocalTime,
  toReadableDate,
  unique,
} from 'src/shared/functions';

describe('/inschrijving', () => {
  beforeEach(async () => await clearAllData());
  afterAll(async () => {
    jest.clearAllMocks();
    await clearAllData();
    await closeClient();
  });

  const request = getRequest(handler);

  const mockedSendMail = jest.spyOn(Mailer, 'sendMail');
  mockedSendMail.mockImplementation();

  describe('/POST', () => {
    it('Should throw InvalidCsRFToken when request has no or invalid csrf token', async () => {
      const inschrijvingPayload = {};

      const randomKlant = createRandomKlant({ verified: true });

      await getController(KLANT).save(randomKlant);

      const bearer = createBearer(randomKlant);

      const response = await request
        .post(POST_INSCHRIJVING)
        .send(inschrijvingPayload)
        .auth(bearer, { type: 'bearer' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: 'Er is iets fout gegaan, probeer later opnieuw...',
      });
    });
    it('Should throw UnauthorizedError when not logged in', async () => {
      const payload = {};
      const randomKlant = createRandomKlant({ verified: true });

      await getController(KLANT).save(randomKlant);

      const response = await request.post(POST_INSCHRIJVING).send(payload);

      expect(response.statusCode).toBe(403);
      expect(response.body).toStrictEqual({ message: 'Not Logged In' });
    });
    it('Should throw ValidationError on wrong request Body', async () => {
      const payload = {};
      const klant = await createRandomKlant({ verified: true });
      await getController(KLANT).save(klant);

      const bearer = createBearer(klant);
      await request
        .post(POST_INSCHRIJVING)
        .auth(bearer, { type: 'bearer' })
        .send(payload)
        .expect(400);
    });
    it('Should throw KlantNotFoundError', async () => {
      const klant = createRandomKlant({ verified: true });
      const bearer = createBearer(klant);
      const payload = {
        csrf: generateCsrf(),
        inschrijvingen: [
          {
            datum: new Date().toISOString(),
            hond_id: new ObjectId(),
            hond_naam: 'Jacko',
            hond_geslacht: 'Reu',
          },
        ],
        training: 'prive',
        klant_id: new ObjectId(),
      };
      const { body } = await request
        .post(POST_INSCHRIJVING)
        .auth(bearer, { type: 'bearer' })
        .send(payload)
        .expect(404);

      expect(body.message).toBe('Klant niet gevonden');
    });
    it('Should throw TrainingNotFoundError', async () => {
      const klant = createRandomKlant({ verified: true });
      await getController(KLANT).save(klant);

      const payload = {
        csrf: generateCsrf(),
        inschrijvingen: [
          {
            datum: new Date().toISOString(),
            hond_id: new ObjectId(),
            hond_naam: 'Jacko',
            hond_geslacht: 'Reu',
          },
        ],
        training: 'test',
        klant_id: klant._id,
      };
      const bearer = createBearer(klant);
      const { body } = await request
        .post(POST_INSCHRIJVING)
        .auth(bearer, { type: 'bearer' })
        .send(payload)
        .expect(404);

      expect(body.message).toBe('Training niet gevonden');
    });
    it('Should throw HondNotFoundError when klant tries to subscribe with a hond that is not found', async () => {
      const klant = createRandomKlant({ verified: true });
      const hond = await createRandomHond();
      const training = createRandomTraining();

      await getController(KLANT).save(klant);
      await getController(TRAINING).save(training);

      const bearer = createBearer(klant);

      const payload = {
        csrf: generateCsrf(),
        inschrijvingen: [
          {
            datum: moment().local().format(),
            hond_id: hond._id,
            hond_naam: hond.naam,
            hond_geslacht: hond.geslacht,
          },
        ],
        training: training.naam,
        klant_id: klant._id,
      };

      const { body } = await request
        .post(POST_INSCHRIJVING)
        .auth(bearer, { type: 'bearer' })
        .send(payload)
        .expect(404);
      expect(body.message).toBe('Hond niet gevonden');
    });
    it('Should throw ReedsIngeschrevenError when klant already subscribed for specific training at that time/day', async () => {
      const training = createRandomTraining();
      const hond = await createRandomHond();
      const klant = createRandomKlant({
        verified: true,
        honden: [hond],
      });

      await getController(TRAINING).save(training);
      await getController(KLANT).save(klant);

      const bearer = createBearer(klant);
      const inschrijving = createRandomInschrijving(klant, hond);
      await getController(INSCHRIJVING).save(inschrijving);
      const payload = {
        csrf: generateCsrf(),
        inschrijvingen: [
          {
            datum: inschrijving.datum,
            hond_id: hond._id.toString(),
            hond_naam: hond.naam,
            hond_geslacht: hond.geslacht,
          },
        ],
        training: 'prive',
        klant_id: klant._id,
      };

      const { body } = await request
        .post(POST_INSCHRIJVING)
        .auth(bearer, { type: 'bearer' })
        .send(payload)
        .expect(422);

      expect(body.message).toBe('Inschrijving niet verwerkt');
    });
    it('Should throw TrainingVolzetError when klant tries to subscribe to a training which has already a subscription at a chose time', async () => {
      const training = await getController(TRAINING).save(createRandomTraining());
      const randomHond = await createRandomHond();
      const randomKlant = await getController(KLANT).save(
        createRandomKlant({
          verified: true,
          honden: [randomHond],
        })
      );

      const inschrijving = await getController(INSCHRIJVING).save(
        createRandomInschrijving(randomKlant, randomHond)
      );

      const hond = await createRandomHond();
      const klant = await getController(KLANT).save(
        await createRandomKlant({ verified: true, honden: [hond] })
      );

      const bearer = createBearer(klant);
      const payload = {
        csrf: generateCsrf(),
        inschrijvingen: [
          {
            datum: inschrijving.datum,
            hond_id: hond._id.toString(),
            hond_naam: hond.naam,
            hond_geslacht: hond.geslacht,
          },
        ],
        training: training.naam,
        klant_id: klant._id,
      };

      const { body } = await request
        .post(POST_INSCHRIJVING)
        .send(payload)
        .auth(bearer, { type: 'bearer' })
        .expect(422);

      expect(body.message).toBe('Dit tijdstip is niet meer vrij');
    });
    it('Should throw EmailNotVerifiedError when klant has not verified email', async () => {
      const klant = await getController(KLANT).save(createRandomKlant());
      const bearer = createBearer(klant);
      const payload = {
        csrf: generateCsrf(),
        inschrijvingen: [
          {
            datum: new Date().toISOString(),
            hond_id: new ObjectId(),
            hond_naam: 'Jacko',
            hond_geslacht: 'Reu',
          },
        ],
        training: 'Prive',
        klant_id: klant._id,
      };

      const { body } = await request
        .post(POST_INSCHRIJVING)
        .auth(bearer, { type: 'bearer' })
        .send(payload)
        .expect(403);
      expect(body.message).toBe('Gelieve uw email te verifiëren');
    });
    it('Should correctly subscribe for the selected training at the selected time', async () => {
      const training = await getController(TRAINING).save(createRandomTraining());
      const hond = createRandomHond();
      const klant = await getController(KLANT).save(
        createRandomKlant({ verified: true, honden: [hond] })
      );

      const bearer = createBearer(klant);
      const payload = {
        csrf: generateCsrf(),
        inschrijvingen: [
          {
            datum: moment().local().format(),
            hond_id: hond._id.toString(),
            hond_naam: hond.naam,
            hond_gelacht: hond.geslacht,
          },
        ],
        training: training.naam,
        klant_id: klant._id,
      };

      const { body } = await request
        .post(POST_INSCHRIJVING)
        .send(payload)
        .auth(bearer, { type: 'bearer' })
        .expect(201);
      expect(body.message).toBe('Inschrijving ontvangen!');
      expect(mockedSendMail).toHaveBeenCalledTimes(2);
    });
  });

  describe('getAvailableForInschrijving', () => {
    it('Should return available and disabled data for trainingdays', async () => {
      const randomKlant1 = createRandomKlant({
        verified: true,
        honden: createRandomHonden(3),
      });
      const randomKlant2 = createRandomKlant({
        verified: true,
        honden: [createRandomHond()],
      });
      const trainingDays = createRandomTrainingDays(5);
      trainingDays[0].date = new Date('2025-01-01');
      trainingDays[0].timeslots = [];
      trainingDays[1].date = new Date('2025-01-06');
      trainingDays[1].timeslots = ['11:00'];
      trainingDays[2].date = new Date('2025-01-15');
      trainingDays[2].timeslots = ['10:00', '17:00'];
      trainingDays[3].date = new Date('2025-02-01');
      trainingDays[3].timeslots = ['11:00', '13:00', '14:00'];
      trainingDays[4].date = new Date('2025-02-03');
      trainingDays[4].timeslots = defaultTrainingTimeSlots;

      const disabled = [
        '2025-01-01',
        '2025-01-02',
        '2025-01-03',
        '2025-01-04',
        '2025-01-05',
        '2025-01-06',
        '2025-01-07',
        '2025-01-08',
        '2025-01-09',
        '2025-01-10',
        '2025-01-11',
        '2025-01-12',
        '2025-01-13',
        '2025-01-14',
        '2025-01-16',
        '2025-01-17',
        '2025-01-18',
        '2025-01-19',
        '2025-01-20',
        '2025-01-21',
        '2025-01-22',
        '2025-01-23',
        '2025-01-24',
        '2025-01-25',
        '2025-01-26',
        '2025-01-27',
        '2025-01-28',
        '2025-01-29',
        '2025-01-30',
        '2025-01-31',
        '2025-02-02',
      ];

      await getController(KLANT).saveMany([randomKlant1, randomKlant2]);
      await getController(TRAININGDAY).saveMany(trainingDays);

      const inschrijvingen1 = createRandomInschrijvingen(randomKlant1, 3);
      const inschrijvingen2 = createRandomInschrijvingen(randomKlant2, 2);

      inschrijvingen1[0].datum = new Date(
        `${trainingDays[1].date.toISOString().split('T')[0]}T11:00:00.000Z`
      );
      inschrijvingen1[1].datum = new Date(
        `${trainingDays[2].date.toISOString().split('T')[0]}T10:00:00.000Z`
      );
      inschrijvingen1[2].datum = new Date(
        `${trainingDays[3].date.toISOString().split('T')[0]}T13:00:00.000Z`
      );
      inschrijvingen2[0].datum = new Date(
        `${trainingDays[4].date.toISOString().split('T')[0]}T10:00:00.000Z`
      );
      inschrijvingen2[1].datum = new Date(
        `${trainingDays[4].date.toISOString().split('T')[0]}T17:00:00.000Z`
      );

      await getController(INSCHRIJVING).saveMany([
        ...inschrijvingen1,
        ...inschrijvingen2,
      ]);

      const available = [
        {
          date: trainingDays[2].date.toISOString().split('T')[0],
          timeslots: ['17:00'],
        },
        {
          date: trainingDays[3].date.toISOString().split('T')[0],
          timeslots: ['11:00', '14:00'],
        },
        {
          date: trainingDays[4].date.toISOString().split('T')[0],
          timeslots: defaultTrainingTimeSlots.filter(
            (item) => item !== '10:00' && item !== '17:00'
          ),
        },
      ];

      const result = await getController(TRAININGDAY).getAvailableForInschrijving();

      expect(result).toEqual(
        expect.objectContaining({
          disabled,
          available: available.map((date) => expect.objectContaining(date)),
        })
      );
    });
  });
});
