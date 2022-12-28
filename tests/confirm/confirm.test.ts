import { createServer, IncomingMessage, RequestListener } from "http";
import { NextApiHandler } from "next";
import { apiResolver } from "next/dist/server/api-utils/node";
import client, { clearAllData } from "src/utils/MongoDb";
import request from "supertest";
import { createRandomConfirmCode } from "src/shared/functions";
import handler from "src/pages/api/confirm/[code].page";
import registerHandler from "src/pages/api/auth/register.page";
import Factory from "src/services/Factory";
import {
  getConfirmByKlantId,
  getConfirmCollection,
} from "src/controllers/ConfirmController";
import { generateRegisterPayloadFromKlantData } from "../helpers";
import { REGISTERAPI } from "src/types/apiTypes";
import { getKlantByEmail } from "src/controllers/KlantController";
import moment from "moment";
import { ObjectId } from "mongodb";
import { CONFIRM } from "src/types/EntityTpes/ConfirmTypes";

describe("/confirm", () => {
  beforeEach(async () => {
    await clearAllData();
  });
  afterAll(async () => {
    await clearAllData();
  });
  let code = createRandomConfirmCode();
  const testClient = (handler: NextApiHandler) => {
    const listener: RequestListener = (req: IncomingMessage, res) => {
      return apiResolver(
        req,
        res,
        { code },
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
  describe("/GET", () => {
    it("Should throw InvalidConfirmCodeError", async () => {
      const response = await testClient(handler).get(`/api/confirm/${code}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual({ message: "Code niet gevonden" });
    });
    it("Should throw ExpiredConfirmCodeError", async () => {
      const klant = await Factory.createRandomKlant();
      const payload = generateRegisterPayloadFromKlantData(klant);
      const { body } = await testClient(registerHandler)
        .post(REGISTERAPI)
        .send(payload);

      await client.connect();
      const confirm = await getConfirmByKlantId(new ObjectId(body._id));
      const valid_to = moment().subtract(1, "hour").local().format();
      await getConfirmCollection().updateOne(
        { _id: confirm?._id },
        { $set: { valid_to } }
      );
      code = confirm!.code;
      await client.close();

      const response = await testClient(handler).get(`/api/confirm/${code}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual({
        message: "Confirm code expired",
      });
    });
    it("Should delete confirmCode and redirect to login", async () => {
      const klant = await Factory.createRandomKlant();
      const payload = generateRegisterPayloadFromKlantData(klant);
      const { body } = await testClient(registerHandler)
        .post(REGISTERAPI)
        .send(payload);

      await client.connect();
      const confirm = await getConfirmByKlantId(new ObjectId(body._id));
      await client.close();

      code = confirm!.code;
      const response = await testClient(handler).get("/api/confirm/");

      expect(response.statusCode).toBe(307);

      const responseCheck = await testClient(handler).get("/api/confirm/");

      expect(responseCheck.status).toBe(404);
      expect(responseCheck.body).toStrictEqual({
        message: "Code niet gevonden",
      });
    });
  });
  describe("/PUT", () => {
    it("should throw InvalidConfirmCodeError", async () => {
      const response = await testClient(handler)
        .put(`/api/confirm/${code}`)
        .send();
      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual({
        message: "Code niet gevonden",
      });
    });
    it("should throw KlantNotFoundError", async () => {
      const confirm = Factory.createConfirm({
        klant_id: new ObjectId(),
        created_at: moment().toDate(),
      });
      confirm.code = code;
      await process.nextTick(() => {});
      await client.connect();
      await Factory.getController(CONFIRM).saveConfirm(confirm);
      await client.close();

      const response = await testClient(handler).put(`/api/confirm/${code}`);
      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual({ message: "Klant niet gevonden" });
    });
    it("Should reset confirmCode", async () => {
      const randomKlant = await Factory.createRandomKlant();
      const payload = generateRegisterPayloadFromKlantData(randomKlant);
      await testClient(registerHandler).post(REGISTERAPI).send(payload);

      await client.connect();
      const klant = await getKlantByEmail(randomKlant.email);
      const confirm = await getConfirmByKlantId(klant!._id);
      await client.close();

      const confirmCode = confirm!.code;
      expect(confirmCode).toBeDefined();
      code = confirmCode;

      const result = await testClient(handler).put("/api/confirm/");
      await client.connect();
      const newConfirm = await getConfirmByKlantId(new ObjectId(klant!._id));
      await client.close();
      const newCode = newConfirm!.code;

      expect(result.statusCode).toBe(200);
      expect(code !== newCode).toBe(true);
    });
  });
});
