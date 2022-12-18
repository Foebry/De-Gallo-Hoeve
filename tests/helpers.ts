import moment from "moment";
import { getKlantByEmail } from "@/controllers/KlantController";
import { getConnection } from "@/utils/MongoDb";
import { generateCsrf } from "@/services/Validator";
import { IsRegisterPayload, IsRegisterResponseBody } from "./auth/types";

export type EnvironmentEnum = "production" | "accept" | "development" | "test";

/**
 * @param env specify the enviroment in which this test should be ran (if "accept" will run for production and accept.
 *
 * If "development" will run for development, accept and production)
 *
 *  accepts: "production" | "accept" | "development" | "test"
 */
export const itif = (
  env: EnvironmentEnum,
  name: string,
  fn?: jest.ProvidesCallback,
  timeout?: number | undefined
) => {
  const priorities = {
    production: 1,
    accept: 2,
    development: 3,
    test: 4,
  };
  const envPriority =
    priorities[process.env.TEST_PRIORITY as keyof typeof priorities];
  const testPriority = priorities[env as keyof typeof priorities] ?? 0;

  if (envPriority === 1) return it(name, fn, timeout);

  return testPriority >= envPriority
    ? it(name, fn, timeout)
    : it.skip(name, fn, timeout);
};

export const generateRegisterResponseBodyFromPayload = async (
  payload: IsRegisterPayload
): Promise<IsRegisterResponseBody> => {
  const klant = await getKlantByEmail(payload.email);
  const response = {
    roles: "",
    verified: false,
    inschrijvingen: [],
    reservaties: [],
    created_at: moment(klant!.created_at).local().toDate(),
    updated_at: klant!.updated_at,
    email: klant!.email,
    vnaam: klant!.vnaam,
    lnaam: klant!.lnaam,
    gsm: klant!.gsm,
    straat: klant!.straat,
    nr: klant!.nr,
    gemeente: klant!.gemeente,
    postcode: klant!.postcode,
    password: klant!.password,
    honden: klant!.honden,
    _id: klant!._id,
    bus: klant!.bus,
  };
  return response;
};

export const generateRegisterPayloadFromKlantData = (
  payload: IsRegisterPayload
) => {
  return {
    ...payload,
    created_at: payload.created_at,
    csrf: generateCsrf(),
  };
};
