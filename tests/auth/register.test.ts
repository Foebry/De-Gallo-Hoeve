import { createServer, IncomingMessage, RequestListener } from "http";
import { NextApiHandler } from "next";
import { apiResolver } from "next/dist/server/api-utils/node";
import handler from "src/pages/api/auth/register.page";
import { REGISTERAPI } from "src/types/apiTypes";
import request from "supertest";
import Factory from "src/services/Factory";
import { clearAllData } from "src/utils/MongoDb";
import { generateRegisterPayloadFromKlantData } from "tests/helpers";
import { capitalize } from "src/shared/functions";
import Mailer from "src/utils/Mailer";

const mock = jest.mock("../../src/utils/Mailer", () => {
  return { sendMail: jest.fn() };
});

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
    const mockedSendMail = jest.spyOn(Mailer, "sendMail");
    mockedSendMail.mockImplementation();

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
      expect(mockedSendMail).toHaveBeenCalledTimes(2);

      expect(body).toEqual(
        expect.objectContaining({
          _id: body._id.toString(),
          roles: "0",
          verified: false,
          inschrijvingen: [],
          reservaties: [],
          email: klant.email,
          vnaam: klant.vnaam,
          lnaam: klant.lnaam,
          gsm: klant.gsm,
          straat: capitalize(klant.straat),
          nr: klant.nr,
          bus: klant.bus,
          gemeente: capitalize(klant.gemeente),
          postcode: klant.postcode,
          honden: expect.arrayContaining([
            expect.objectContaining({
              naam: klant.honden[0].naam,
              geslacht: klant.honden[0].geslacht,
              ras: klant.honden[0].ras,
            }),
            expect.objectContaining({
              geslacht: klant.honden[1].geslacht,
              naam: klant.honden[1].naam,
              ras: klant.honden[1].ras,
            }),
            expect.objectContaining({
              geslacht: klant.honden[2].geslacht,
              naam: klant.honden[2].naam,
              ras: klant.honden[2].ras,
            }),
          ]),
        })
      );
    });
    it("Should throw EmailOccupiedError", async () => {
      const klant = await (await Factory.createRandomKlant()).save();
      const newKlant = await Factory.createRandomKlant();
      newKlant.email = klant.email;
      const payload = generateRegisterPayloadFromKlantData(newKlant);

      const client = testClient(handler);
      const { body } = await client.post(REGISTERAPI).send(payload).expect(422);

      expect(body).toStrictEqual({
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
    const { body } = await client.post(REGISTERAPI).send(payload).expect(400);

    expect(body).toStrictEqual({
      email: "ongeldige email",
      message: "Registratie niet verwerkt",
    });
  });
});
