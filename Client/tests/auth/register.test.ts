import { createServer, IncomingMessage, RequestListener } from "http";
import { NextApiHandler } from "next";
import { apiResolver } from "next/dist/server/api-utils/node";
import handler from "../../pages/api/auth/register";
import request from "supertest";
import Factory from "../../middlewares/Factory";
import { clearAllData } from "../../middlewares/MongoDb";
import { REGISTERAPI } from "@/types/apiTypes";
import {
  generateRegisterPayloadFromKlantData,
  generateRegisterResponseBodyFromPayload,
} from "@/tests/helpers";
import { sendMail } from "@middlewares/Mailer";

jest.mock("@middlewares/Mailer", () => {
  return {
    sendMail: jest.fn().mockResolvedValue("sending mock email"),
  };
});
import dbClient from "@middlewares/MongoDb";
import { ObjectId } from "mongodb";

describe("/register", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
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
  describe("/POST", () => {
    it("should create new klant", async () => {
      const honden = await Promise.all(
        new Array(3).fill(0).map(async () => {
          return Factory.createRandomHond();
        })
      );
      const klant = await Factory.createRandomKlant();
      klant.honden = honden;
      const payload = generateRegisterPayloadFromKlantData(klant);

      const client = testClient(handler);

      const { body } = await client.post(REGISTERAPI).send(payload).expect(201);

      await dbClient.connect();
      const code = await Factory.getController(
        "ConfirmController"
      ).getConfirmByKlantId(new ObjectId(body._id));
      await dbClient.close();

      expect(sendMail).toHaveBeenCalledTimes(2);
      expect(sendMail).toHaveBeenNthCalledWith(1, "register", {
        email: klant.email,
        vnaam: klant.vnaam,
        code: code?.code,
      });
      expect(sendMail).toHaveBeenNthCalledWith(2, "register-headsup", {
        email: "sander.fabry@gmail.com",
        klant_id: body._id,
      });
    });
    it("Should throw EmailOccupiedError", async () => {
      const klant = await (await Factory.createRandomKlant()).save();
      const newKlant = await Factory.createRandomKlant();
      newKlant.email = klant.email;
      const payload = generateRegisterPayloadFromKlantData(newKlant);

      const client = testClient(handler);
      const response = await client.post(REGISTERAPI).send(payload);
      await generateRegisterResponseBodyFromPayload(payload);

      expect(response.statusCode).toBe(422);
      expect(response.body).toStrictEqual({
        message: "Kan registratie niet verwerken",
        email: "Email reeds in gebruik",
      });
    });
  });
  it("Should throw ValidationError", async () => {
    const klant = await Factory.createRandomKlant();
    klant.email = "test@t";
    const payload = generateRegisterPayloadFromKlantData(klant);

    const client = testClient(handler);
    const response = await client.post(REGISTERAPI).send(payload);

    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      email: "ongeldige email",
      message: "Registratie niet verwerkt",
    });
  });
});
