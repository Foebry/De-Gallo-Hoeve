import { createServer, IncomingMessage, RequestListener } from "http";
import { NextApiHandler } from "next";
import request from "supertest";
import { apiResolver } from "next/dist/server/api-utils/node";
import { clearAllData } from "../../middleware/MongoDb";
import { LOGINAPI, POST_INSCHRIJVING } from "../../types/apiTypes";
import handler from "../../pages/api/inschrijvingen";
import Factory from "../../middleware/Factory";
import { generateCsrf } from "../../middleware/Validator";
import loginHandler from "../../pages/api/auth/login";
import { createBearer } from "../../middleware/Authenticator";
import { ObjectId } from "mongodb";
import moment from "moment";

describe("/inschrijving", () => {
  beforeEach(async () => {
    await clearAllData();
  });
  // afterAll(async () => {
  //   await clearAllData();
  // });
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
  describe("/POST", () => {
    it("Should throw InvalidCsRFToken when request has no or invalid csrf token", async () => {
      const inschrijvingPayload = {};

      const randomKlant = await Factory.createRandomKlant({ verified: true });
      const email = randomKlant.email;
      const psw = randomKlant.password;

      await randomKlant.save();
      const loginResponse = await testClient(loginHandler)
        .post(LOGINAPI)
        .send({ email, password: psw, csrf: generateCsrf() });

      const JWT = loginResponse.headers["set-cookie"].find((cookie: string) =>
        cookie.includes("JWT")
      );
      const bearer = JWT.split("JWT=")[1].split(";")[0];

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

      await randomKlant.save();

      const response = await testClient(handler)
        .post(POST_INSCHRIJVING)
        .send(payload);

      expect(response.statusCode).toBe(403);
      expect(response.body).toStrictEqual({ message: "Not Logged In" });
    });
    it("Should throw ValidationError on wrong request Body", async () => {
      const payload = {};
      const klant = await Factory.createRandomKlant({ verified: true });
      await klant.save();

      const bearer = createBearer(klant);
      const { body } = await testClient(handler)
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
      const klant = await (
        await Factory.createRandomKlant({ verified: true })
      ).save();
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
      const klant = await (
        await Factory.createRandomKlant({ verified: true })
      ).save();
      const hond = await Factory.createRandomHond();
      const training = await Factory.createRandomTraining("prive").save();
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
      await Factory.createRandomTraining("prive").save();
      const hond = await Factory.createRandomHond();
      const klant = await Factory.createRandomKlant({
        verified: true,
        honden: [hond],
      });
      await klant.save();

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

      expect(body.message).toBe("U bent reeds ingeschreven voor deze training");
    });
    it("Should throw TrainingVolzetError when klant tries to subscribe to a training which has already a subscription at a chose time", async () => {
      const training = await Factory.createRandomTraining("prive").save();
      const randomHond = await Factory.createRandomHond();
      const randomKlant = await (
        await Factory.createRandomKlant({
          verified: true,
          honden: [randomHond],
        })
      ).save();
      const inschrijving = await Factory.createRandomInschrijving(
        randomKlant,
        randomHond
      ).save();

      const hond = await Factory.createRandomHond();
      const klant = await (
        await Factory.createRandomKlant({ verified: true, honden: [hond] })
      ).save();
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
      const klant = await (await Factory.createRandomKlant()).save();
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
      const training = await Factory.createRandomTraining("prive").save();
      const hond = await Factory.createRandomHond();
      const klant = await (
        await Factory.createRandomKlant({ verified: true, honden: [hond] })
      ).save();
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
    });
  });
});
