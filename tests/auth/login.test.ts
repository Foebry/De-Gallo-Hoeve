import { LOGINAPI } from "@/types/apiTypes";
import { generateCsrf } from "@/services/Validator";
import { NextApiHandler } from "next";
import { createServer, IncomingMessage, RequestListener } from "http";
import request from "supertest";
import { apiResolver } from "next/dist/server/api-utils/node";
import handler from "@/pages/api/auth/login.page";
import { clearAllData } from "@/utils/MongoDb";
import Factory from "@/services/Factory";

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
      // csrf: generateCsrf(),
      email: "rain_fabry@hotmail.com",
      password: "password",
    };
    const client = testClient(handler);
    const response = await client.post(LOGINAPI).send(loginPayload);

    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Probeer later opnieuw...",
    });
  });
  it("login with wrong email should throw InvalidEmailError", async () => {
    const loginPayload = {
      csrf: generateCsrf(),
      email: "rain_fabry@hotmail.com",
      password: "password",
    };
    const response = await testClient(handler)
      .post(LOGINAPI)
      .send(loginPayload);

    expect(response.statusCode).toBe(422);
    expect(response.body).toStrictEqual({
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
    const response = await testClient(handler)
      .post(LOGINAPI)
      .send(loginPayload);
    expect(response.statusCode).toBe(422);
    expect(response.body).toStrictEqual({
      password: "Ongeldig wachtwoord",
      message: "Kan verzoek niet verwerken",
    });
  });
  it("Login with correct credentials should create jwt token and frontend token", async () => {
    const klant = await Factory.createRandomKlant();
    await klant.save();

    const loginPayload = {
      csrf: generateCsrf(),
      email: klant.email,
      password: klant.password,
    };

    const response = await testClient(handler)
      .post(LOGINAPI)
      .send(loginPayload);

    expect(response.statusCode).toBe(200);
    expect(Object.keys(response.headers["set-cookie"]).includes("JWT"));
    expect(response.headers["set-cookie"].includes("Client"));
  });
});
