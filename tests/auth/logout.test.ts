import { createServer, IncomingMessage, RequestListener } from "http";
import { NextApiHandler } from "next";
import { apiResolver } from "next/dist/server/api-utils/node";
import Factory from "@/services/Factory";
import { clearAllData, getConnection } from "@/utils/MongoDb";
import { generateCsrf } from "@/services/Validator";
import handler from "@/pages/api/auth/logout.page";
import loginHandler from "@/pages/api/auth/login.page";
import request from "supertest";
import { LOGINAPI, LOGOUT } from "@/types/apiTypes";

describe("/logout", () => {
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
  describe("/DELETE", () => {
    it("Should remove Client and JWT on successfull logout", async () => {
      const klant = await Factory.createRandomKlant();
      await klant.save();

      const loginPayload = {
        csrf: generateCsrf(),
        email: klant.email,
        password: klant.password,
      };
      const response = await testClient(loginHandler)
        .post(LOGINAPI)
        .send(loginPayload);

      expect(response.statusCode).toBe(200);
      expect(response.headers["set-cookie"].includes("JWT"));
      expect(response.headers["set-cookie"].includes("Client"));

      const logoutResponse = await testClient(handler).delete(LOGOUT).send();

      expect(!logoutResponse.headers["set-cookie"].includes("JWT"));
      expect(!logoutResponse.headers["set-cookie"].includes("Client"));
    });
  });
});
