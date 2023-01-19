import { createServer, IncomingMessage, RequestListener } from "http";
import { NextApiHandler } from "next";
import { apiResolver } from "next/dist/server/api-utils/node";
import { clearAllData } from "src/utils/MongoDb";
import request from "supertest";
import handler from "src/pages/api/confirm/[code].page";
import Factory, {
  createRandomConfirm,
  createRandomKlant,
  getController,
} from "src/services/Factory";
import { CONFIRM } from "src/types/EntityTpes/ConfirmTypes";
import { getConfirmByCode } from "src/controllers/ConfirmController";
import { closeClient } from "src/utils/db";
import { KLANT } from "src/controllers/KlantController";

describe("/confirm", () => {
  beforeEach(async () => {
    await clearAllData();
  });
  afterAll(async () => {
    await clearAllData();
    closeClient();
  });
  let code: string;
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
      const randomConfirm = createRandomConfirm();
      code = randomConfirm.code;

      const response = await testClient(handler).get(`/api/confirm/`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual({ message: "Code niet gevonden" });
    });

    it("Should throw ExpiredConfirmCodeError", async () => {
      const randomKlant = await Factory.createRandomKlant();
      const randomConfirm = createRandomConfirm(randomKlant);

      randomConfirm.valid_to = new Date("1991-01-01");

      await getController(CONFIRM).save(randomConfirm);

      code = randomConfirm.code;

      const { body } = await testClient(handler)
        .get(`/api/confirm/`)
        .expect(404);

      expect(body).toStrictEqual({
        message: "Confirm code expired",
      });
    });

    it("Should delete confirmCode and redirect to login", async () => {
      const randomKlant = await createRandomKlant();
      const randomConfirm = createRandomConfirm(randomKlant);

      await getController(KLANT).save(randomKlant);
      await getController(CONFIRM).save(randomConfirm);

      code = randomConfirm.code;
      await testClient(handler).get(`/api/confirm/`).expect(307);

      const confirm = await getConfirmByCode(randomConfirm.code);
      expect(confirm).toBeNull();
    });
  });

  describe("/PUT", () => {
    it("should throw InvalidConfirmCodeError", async () => {
      const randomConfirm = createRandomConfirm();
      code = randomConfirm.code;

      const response = await testClient(handler)
        .put(`/api/confirm/`)
        .expect(404);

      expect(response.body).toStrictEqual({
        message: "Code niet gevonden",
      });
    });

    it("should throw KlantNotFoundError", async () => {
      const randomConfirm = createRandomConfirm();
      await getController(CONFIRM).save(randomConfirm);

      code = randomConfirm.code;

      const response = await testClient(handler)
        .put(`/api/confirm/`)
        .expect(404);

      expect(response.body).toStrictEqual({ message: "Klant niet gevonden" });
    });

    it("Should reset confirmCode", async () => {
      const randomKlant = await createRandomKlant();
      const randomConfirm = createRandomConfirm(randomKlant);

      await getController(KLANT).save(randomKlant);
      await getController(CONFIRM).save(randomConfirm);

      code = randomConfirm.code;

      const { body } = await testClient(handler)
        .put(`/api/confirm/`)
        .expect(200);

      expect(body.code).toBeDefined();
      expect(body.code !== randomConfirm.code).toBe(true);
    });
  });
});
