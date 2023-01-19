import { createServer, IncomingMessage, RequestListener } from "http";
import { NextApiHandler } from "next";
import request from "supertest";
import { apiResolver } from "next/dist/server/api-utils/node";
import { clearAllData } from "src/utils/MongoDb";
import { POST_INSCHRIJVING } from "src/types/apiTypes";
import handler from "src/pages/api/inschrijvingen.page";
import Factory, {
  createRandomHond,
  createRandomInschrijving,
  createRandomKlant,
  createRandomTraining,
  getController,
} from "src/services/Factory";
import { generateCsrf } from "src/services/Validator";
import { createBearer } from "src/services/Authenticator";
import { ObjectId } from "mongodb";
import moment from "moment";
import Mailer from "../../src/utils/Mailer";
import { KLANT } from "src/controllers/KlantController";
import { TRAINING } from "src/controllers/TrainingController";
import { INSCHRIJVING } from "src/controllers/InschrijvingController";

describe("/inschrijving", () => {
  beforeEach(async () => await clearAllData());
  afterAll(async () => {
    jest.clearAllMocks();
    await clearAllData();
  });

  const testClient = (handler: NextApiHandler) => {
    const listener: RequestListener = (req: IncomingMessage, res) => {
      return apiResolver(
        req,
        res,
        undefined,
        handler,
        {
          previewModeEncryptionKey: "",
          previewModeId: "",
          previewModeSigningKey: "",
        },
        false
      );
    };
    return request(createServer(listener));
  };

  const mockedSendMail = jest.spyOn(Mailer, "sendMail");
  mockedSendMail.mockImplementation();

  describe("/POST", () => {
    it("Should throw InvalidCsRFToken when request has no or invalid csrf token", async () => {
      const inschrijvingPayload = {};

      const randomKlant = await Factory.createRandomKlant({ verified: true });

      await getController(KLANT).save(randomKlant);

      const bearer = createBearer(randomKlant);

      const response = await testClient(handler)
        .post(POST_INSCHRIJVING)
        .send(inschrijvingPayload)
        .auth(bearer, { type: "bearer" });

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: "Probeer later opnieuw...",
      });
    });
    it("Should throw UnauthorizedError when not logged in", async () => {
      const payload = {};
      const randomKlant = await Factory.createRandomKlant({ verified: true });

      await getController(KLANT).save(randomKlant);

      const response = await testClient(handler)
        .post(POST_INSCHRIJVING)
        .send(payload);

      expect(response.statusCode).toBe(403);
      expect(response.body).toStrictEqual({ message: "Not Logged In" });
    });
    it("Should throw ValidationError on wrong request Body", async () => {
      const payload = {};
      const klant = await Factory.createRandomKlant({ verified: true });
      await getController(KLANT).save(klant);

      const bearer = createBearer(klant);
      await testClient(handler)
        .post(POST_INSCHRIJVING)
        .auth(bearer, { type: "bearer" })
        .send(payload)
        .expect(400);
    });
    it("Should throw KlantNotFoundError", async () => {
      const klant = await Factory.createRandomKlant({ verified: true });
      const bearer = createBearer(klant);
      const payload = {
        csrf: generateCsrf(),
        inschrijvingen: [
          {
            datum: new Date().toISOString(),
            hond_id: new ObjectId(),
            hond_naam: "Jacko",
            hond_geslacht: "Reu",
          },
        ],
        training: "prive",
        klant_id: new ObjectId(),
      };
      const { body } = await testClient(handler)
        .post(POST_INSCHRIJVING)
        .auth(bearer, { type: "bearer" })
        .send(payload)
        .expect(404);

      expect(body.message).toBe("Klant niet gevonden");
    });
    it("Should throw TrainingNotFoundError", async () => {
      const klant = await createRandomKlant({ verified: true });
      await getController(KLANT).save(klant);

      const payload = {
        csrf: generateCsrf(),
        inschrijvingen: [
          {
            datum: new Date().toISOString(),
            hond_id: new ObjectId(),
            hond_naam: "Jacko",
            hond_geslacht: "Reu",
          },
        ],
        training: "test",
        klant_id: klant._id,
      };
      const bearer = createBearer(klant);
      const { body } = await testClient(handler)
        .post(POST_INSCHRIJVING)
        .auth(bearer, { type: "bearer" })
        .send(payload)
        .expect(404);

      expect(body.message).toBe("Training niet gevonden");
    });
    it("Should throw HondNotFoundError when klant tries to subscribe with a hond that is not found", async () => {
      const klant = await createRandomKlant({ verified: true });
      const hond = await Factory.createRandomHond();
      const training = Factory.createRandomTraining("prive");

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

      const { body } = await testClient(handler)
        .post(POST_INSCHRIJVING)
        .auth(bearer, { type: "bearer" })
        .send(payload)
        .expect(404);
      expect(body.message).toBe("Hond niet gevonden");
    });
    it("Should throw ReedsIngeschrevenError when klant already subscribed for specific training at that time/day", async () => {
      const training = createRandomTraining("prive");
      const hond = await Factory.createRandomHond();
      const klant = await Factory.createRandomKlant({
        verified: true,
        honden: [hond],
      });

      await getController(TRAINING).save(training);
      await getController(KLANT).save(klant);

      const bearer = createBearer(klant);
      const inschrijving = await Factory.createRandomInschrijving(
        klant,
        hond
      ).save();
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
        training: "prive",
        klant_id: klant._id,
      };

      const { body } = await testClient(handler)
        .post(POST_INSCHRIJVING)
        .auth(bearer, { type: "bearer" })
        .send(payload)
        .expect(422);

      expect(body.message).toBe("Inschrijving niet verwerkt");
    });
    it("Should throw TrainingVolzetError when klant tries to subscribe to a training which has already a subscription at a chose time", async () => {
      const training = await getController(TRAINING).save(
        createRandomTraining("prive")
      );
      const randomHond = await createRandomHond();
      const randomKlant = await getController(KLANT).save(
        await createRandomKlant({
          verified: true,
          honden: [randomHond],
        })
      );

      const inschrijving = await getController(INSCHRIJVING).save(
        createRandomInschrijving(randomKlant, randomHond)
      );

      const hond = await Factory.createRandomHond();
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

      const { body } = await testClient(handler)
        .post(POST_INSCHRIJVING)
        .send(payload)
        .auth(bearer, { type: "bearer" })
        .expect(422);

      expect(body.message).toBe("Dit tijdstip is niet meer vrij");
    });
    it("Should throw EmailNotVerifiedError when klant has not verified email", async () => {
      const klant = await getController(KLANT).save(
        await Factory.createRandomKlant()
      );
      const bearer = createBearer(klant);
      const payload = {
        csrf: generateCsrf(),
        inschrijvingen: [
          {
            datum: new Date().toISOString(),
            hond_id: new ObjectId(),
            hond_naam: "Jacko",
            hond_geslacht: "Reu",
          },
        ],
        training: "Prive",
        klant_id: klant._id,
      };

      const { body } = await testClient(handler)
        .post(POST_INSCHRIJVING)
        .auth(bearer, { type: "bearer" })
        .send(payload)
        .expect(403);
      expect(body.message).toBe("Gelieve uw email te verifiëren");
    });
    it("Should correctly subscribe for the selected training at the selected time", async () => {
      const training = await getController(TRAINING).save(
        createRandomTraining("prive")
      );
      const hond = await Factory.createRandomHond();
      const klant = await getController(KLANT).save(
        await createRandomKlant({ verified: true, honden: [hond] })
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

      const { body } = await testClient(handler)
        .post(POST_INSCHRIJVING)
        .send(payload)
        .auth(bearer, { type: "bearer" })
        .expect(201);
      expect(body.message).toBe("Inschrijving ontvangen!");
      expect(mockedSendMail).toHaveBeenCalledTimes(2);
    });
  });
});
