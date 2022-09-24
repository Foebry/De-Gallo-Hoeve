import {
  getKlantByEmail,
  getKlantCollection,
} from "../controllers/KlantController";
import client from "../middleware/MongoDb";
import { generateCsrf } from "../middleware/Validator";
import {
  IsRegisterPayload,
  IsRegisterResponseBody,
  RegisterBodyType,
} from "./auth/types";

export const generateRegisterResponseBodyFromPayload = async (
  payload: IsRegisterPayload
): Promise<IsRegisterResponseBody> => {
  await client.connect();
  const klant = await getKlantByEmail(payload.email);
  const response = {
    roles: "",
    verified: false,
    inschrijvingen: [],
    reservaties: [],
    created_at: klant!.created_at,
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
    message: "Registratie succesvol!" as string,
    _id: klant!._id,
    bus: klant!.bus,
  };
  return response;
};

export const generateRegisterPayloadFromKlantData = (
  payload: IsRegisterPayload
) => {
  return { ...payload, csrf: generateCsrf() };
};
