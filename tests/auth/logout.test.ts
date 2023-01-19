import { createServer, IncomingMessage, RequestListener } from "http";
import { NextApiHandler } from "next";
import { apiResolver } from "next/dist/server/api-utils/node";
import Factory from "src/services/Factory";
import { clearAllData } from "src/utils/MongoDb";
import { generateCsrf } from "src/services/Validator";
import handler from "src/pages/api/auth/logout.page";
import loginHandler from "src/pages/api/auth/login.page";
import request from "supertest";
import { LOGINAPI, LOGOUT } from "src/types/apiTypes";
import { createBearer } from "src/services/Authenticator";

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
      const bearer = createBearer(klant);

      const logoutResponse = await testClient(handler)
        .delete(LOGOUT)
        .set("bearer", bearer)
        .send()
        .expect(200);

      expect(logoutResponse.headers["set-cookie"].includes("JWT")).toBe(false);
      expect(logoutResponse.headers["set-cookie"].includes("Client")).toBe(
        false
      );
    });
  });
});
