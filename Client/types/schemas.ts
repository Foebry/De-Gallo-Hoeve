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
    .matches(/^[a-z ,.'-éëèçêïü]+$/i, {
      message: { vnaam: "Kan enkel letters bevatten" },
    })
    .required({ vnaam: "Voornaam is required" })
    .max(255, { vnaam: "Maximaal 255 characters" }),
  lnaam: string()
    .required({ lnaam: "Naam is required" })
    .matches(/^[a-z ,.'-éëèçêïü]+$/i, {
      message: { lnaam: "Kan enkel letters bevatten" },
    }),
  gsm: string().required({ gsm: "Telefoon is required" }),
  straat: string()
    .required({ straat: "Straat is required" })
    .matches(/^[a-z ,.'-éëèçêïü]+$/i, {
      message: { straat: "Kan enkel letters bevatten" },
    }),
  nr: number().required({ nr: "Huisnr is required" }),
  gemeente: string()
    .required({ gemeente: "Gemeente is required" })
    .matches(/^[a-z ,.'-éëèçêïü]+$/i, {
      message: { gemeente: "Kan enkel letters bevatten" },
    }),
  postcode: number().required({ postcode: "Postcode is required" }),
  honden: array(
    object({
      ras_id: number().required({ ras_id: "Gelieve een ras te selecteren" }),
      naam: string()
        .required({ naam: "Naam is required" })
        .matches(/^[a-z ,.'-éëèçêïü]+$/i, {
          message: { honden: "Kan enkel letters bevatten" },
        }),
      geboortedatum: date().required({
        geboortedatum: "Geboortedatum is required",
      }),
      chip_nr: string().optional().default(""),
      geslacht: string().required({
        geslacht: "Gelieve een geslacht aan te duiden",
      }),
    })
  ),
});

const inschrijving = object({
  inschrijvingen: array(
    object({
      datum: string().required({ message: "Ongeldige datum" }),
      hond_id: number().optional(),
      hond_naam: string().optional(),
      hond_ras: number().optional(),
      hond_geslacht: string().optional(),
    })
  ).required({ message: "Geen datum geselecteerd" }),
  training_id: number().required({ message: "Ongeldige training" }),
  klant_id: number().optional().nullable(),
  email: string()
    .email({ message: "ongeldige email", email: "ongeldige email" })
    .optional(),
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
