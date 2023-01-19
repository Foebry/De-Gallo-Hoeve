import moment from "moment";
import { getKlantByEmail } from "src/controllers/KlantController";
import { generateCsrf } from "src/services/Validator";
import { IsRegisterPayload, IsRegisterResponseBody } from "./auth/types";

export const generateRegisterResponseBodyFromPayload = async (
  payload: IsRegisterPayload
): Promise<IsRegisterResponseBody> => {
  // await client.connect();
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
