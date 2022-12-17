import { createServer, IncomingMessage, RequestListener } from "http";
import { NextApiHandler } from "next";
import { apiResolver } from "next/dist/server/api-utils/node";
import { clearAllData, getConnection } from "@/utils/MongoDb";
import request from "supertest";
import handler from "@/pages/api/confirm/[code].page";
import registerHandler from "@/pages/api/auth/register.page";
import Factory from "@/services/Factory";
import {
  getConfirmByKlantId,
  getConfirmCollection,
} from "@/controllers/ConfirmController";
import { generateRegisterPayloadFromKlantData } from "../helpers";
import { REGISTERAPI } from "@/types/apiTypes";
import { getKlantByEmail } from "@/controllers/KlantController";
import moment from "moment";
import { ObjectId } from "mongodb";
import { CONFIRM } from "@/types/EntityTpes/ConfirmTypes";
import { createRandomConfirmCode } from "@/shared/functions";

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
      const confirmCollection = await getConfirmCollection();
      const { body } = await testClient(registerHandler)
        .post(REGISTERAPI)
        .send(payload);

      const confirm = await getConfirmByKlantId(new ObjectId(body._id));
      const valid_to = moment().subtract(1, "hour").local().format();
      await confirmCollection.updateOne(
        { _id: confirm?._id },
        { $set: { valid_to } }
      );
      code = confirm!.code;

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

      const confirm = await getConfirmByKlantId(new ObjectId(body._id));

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
      await Factory.getController(CONFIRM).saveConfirm(confirm);

      const response = await testClient(handler).put(`/api/confirm/${code}`);
      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual({ message: "Klant niet gevonden" });
    });
    it("Should reset confirmCode", async () => {
      const randomKlant = await Factory.createRandomKlant();
      const payload = generateRegisterPayloadFromKlantData(randomKlant);
      await testClient(registerHandler).post(REGISTERAPI).send(payload);

      const klant = await getKlantByEmail(randomKlant.email);
      const confirm = await getConfirmByKlantId(klant!._id);

      const confirmCode = confirm!.code;
      expect(confirmCode).toBeDefined();
      code = confirmCode;

      const result = await testClient(handler).put("/api/confirm/");
      const newConfirm = await getConfirmByKlantId(new ObjectId(klant!._id));
      const newCode = newConfirm!.code;

      expect(result.statusCode).toBe(200);
      expect(code !== newCode).toBe(true);
    });
  });
});
