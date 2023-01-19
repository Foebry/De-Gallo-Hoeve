import { LOGINAPI } from "src/types/apiTypes";
import { generateCsrf } from "src/services/Validator";
import { NextApiHandler } from "next";
import { createServer, IncomingMessage, RequestListener } from "http";
import request from "supertest";
import { apiResolver } from "next/dist/server/api-utils/node";
import handler from "src/pages/api/auth/login.page";
import { clearAllData } from "src/utils/MongoDb";
import Factory, {
  createRandomKlant,
  getController,
} from "src/services/Factory";
import { KLANT } from "src/controllers/KlantController";

describe("login", () => {
  beforeEach(async () => {
    await clearAllData();
  });
  afterAll(async () => {
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
  it("login without csrf should result in bad request", async () => {
    const loginPayload = {
      email: "rain_fabry@hotmail.com",
      password: "password",
    };
    const client = testClient(handler);
    const { body } = await client.post(LOGINAPI).send(loginPayload).expect(400);

    expect(body).toStrictEqual({
      message: "Probeer later opnieuw...",
    });
  });
  it("login with wrong email should throw InvalidEmailError", async () => {
    const loginPayload = {
      csrf: generateCsrf(),
      email: "rain_fabry@hotmail.com",
      password: "password",
    };
    const { body } = await testClient(handler)
      .post(LOGINAPI)
      .send(loginPayload)
      .expect(422);

    expect(body).toStrictEqual({
      email: "Onbekende email",
      message: "Kan verzoek niet verwerken",
    });
  });
  it("Login with wrong password should throw InvalidPasswordError", async () => {
    const klant = await (await Factory.createRandomKlant()).save();
    const loginPayload = {
      csrf: generateCsrf(),
      email: klant.email,
      password: "abc",
    };
    const { body } = await testClient(handler)
      .post(LOGINAPI)
      .send(loginPayload)
      .expect(422);

    expect(body).toStrictEqual({
      password: "Ongeldig wachtwoord",
      message: "Kan verzoek niet verwerken",
    });
  });
  it("Login with correct credentials should create jwt token and frontend token", async () => {
    const klant = await createRandomKlant();
    await getController(KLANT).save(klant);

    const loginPayload = {
      csrf: generateCsrf(),
      email: klant.email,
      password: klant.password,
    };

    const response = await testClient(handler)
      .post(LOGINAPI)
      .send(loginPayload)
      .expect(200);

    expect(Object.keys(response.headers["set-cookie"]).includes("JWT"));
    expect(response.headers["set-cookie"].includes("Client"));
  });
});
