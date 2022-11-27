import { createServer, IncomingMessage, RequestListener } from "http";
import { NextApiHandler } from "next";
import { apiResolver } from "next/dist/server/api-utils/node";
import handler from "../../pages/api/auth/register";
import { REGISTERAPI } from "../../types/apiTypes";
import request from "supertest";
import Factory from "../../middlewares/Factory";
import { clearAllData } from "../../middlewares/MongoDb";
import {
  generateRegisterPayloadFromKlantData,
  generateRegisterResponseBodyFromPayload,
} from "../../tests/helpers";
import moment from "moment";

describe("/register", () => {
  beforeEach(async () => {
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
      const response = await client.post(REGISTERAPI).send(payload);
      const body = await generateRegisterResponseBodyFromPayload(payload);

      expect(response.statusCode).toBe(201);
      expect(response.body).toStrictEqual({
        ...body,
        _id: body._id.toString(),
        honden: [...body.honden].map((hond) => ({
          ...hond,
          _id: hond._id.toString(),
        })),
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
