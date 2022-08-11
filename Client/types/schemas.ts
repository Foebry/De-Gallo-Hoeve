import { array, boolean, date, number, object, string } from "yup";

const login = object({
  csrf: string().required({ message: "Er is een probleem" }),
  email: string()
    .email({ email: "invalid email" })
    .required({ email: "email is required" }),
  password: string().required({ password: "password is required" }),
});

const register = object({
  csrf: string().required({ message: "Invalid form" }),
  email: string()
    .email({ email: "invalid email" })
    .required({ email: "email is required" }),
  password: string().required({ password: "password is required" }),
  vnaam: string()
    .required({ vnaam: "Voornaam is required" })
    .max(1, { vnaam: "Maximaal 1 characters" }),
  lnaam: string().required({ lnaam: "Naam is required" }),
  gsm: string().required({ gsm: "Telefoon is required" }),
  straat: string().required({ straat: "Straat is required" }),
  nr: number().required({ nr: "Huisnr is required" }),
  gemeente: string().required({ gemeente: "Gemeente is required" }),
  postcode: number().required({ postcode: "Postcode is required" }),
  honden: array(
    object({
      ras_id: number().required({ ras_id: "Gelieve een ras te selecteren" }),
      naam: string().required({ naam: "Naam is required" }),
      geboortedatum: date().required({
        geboortedatum: "Geboortedatum is required",
      }),
      chip_nr: string().optional(),
      geslacht: number()
        .min(0, { geslacht: "Invalid geslacht" })
        .max(1, { geslacht: "Invalid geslacht" })
        .required({ geslacht: "Gelieve een geslacht aan te duiden" }),
    })
  ),
});

const inschrijving = object({
  csrf: string().required({ failure: "Invalid form" }),
  hond_id: number().required(),
  training_id: number().required(),
  klant_id: number().required(),
  datum: date().required(),
});

const boeking = object({
  csrf: string().required({ failure: "Invalid form" }),
  klant_id: number().required(),
  start: date().required(),
  eind: date().required(),
  details: array(
    object({
      kennel_id: number().required(),
      hond_id: number().required(),
      loops: date().optional(),
      ontsnapping: boolean().required(),
      sociaal: boolean().required(),
      medicatie: boolean().required(),
      extra: string().optional(),
    })
  ).required({ details: "Gelieve minstens 1 hond op te geven" }),
});

const schemas = { login, register, inschrijving, boeking };

export const {
  login: loginSchema,
  register: registerSchema,
  inschrijving: inschrijvingSchema,
  boeking: boekingSchema,
} = schemas;
