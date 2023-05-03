import { array, boolean, date, number, object, string } from 'yup';

const login = object({
  csrf: string().required({ message: 'Er is een probleem' }),
  email: string()
    .email({ email: 'ongeldige email' })
    .required({ email: 'email is verplicht' }),
  password: string().required({ password: 'password is verplicht' }),
});

const register = object({
  csrf: string().required({ message: 'Invalid form' }),
  email: string()
    .email({ email: 'ongeldige email' })
    .required({ email: 'verplicht veld' }),
  password: string()
    .required({ password: 'verplicht veld' })
    .min(8, { password: 'Minstens 8 characters' })
    .matches(/[a-z]+/, { message: { password: 'Minstens 1 kleine letter' } })
    .matches(/[A-Z]+/, { message: { password: 'Minstens 1 hoofdletter' } })
    .matches(/[&é@#§è!çà$£µ%ù?./<>°}{"'^*+-=~},;]+/, {
      message: { password: 'Minstens 1 speciaal character' },
    })
    .matches(/[0-9]+/, { message: { password: 'Minstens 1 cijfer' } }),
  vnaam: string()
    .matches(/^[a-z ,.'-éëèçêïü]+$/i, {
      message: { vnaam: 'Kan enkel letters bevatten' },
    })
    .required({ vnaam: 'verplicht veld' })
    .max(255, { vnaam: 'Maximaal 255 characters' }),
  lnaam: string()
    .required({ lnaam: 'verplicht veld' })
    .matches(/^[a-z ,.'-éëèçêïü]+$/i, {
      message: { lnaam: 'Kan enkel letters bevatten' },
    }),
  gsm: string().required({ gsm: 'verplicht veld' }),
  straat: string()
    .required({ straat: 'verplicht veld' })
    .matches(/^[a-z ,.'-éëèçêïü]+$/i, {
      message: { straat: 'Kan enkel letters bevatten' },
    }),
  nr: number().required({ nr: 'verplicht veld' }).typeError({ nr: 'cijfer...' }),
  gemeente: string()
    .required({ gemeente: 'verplicht veld' })
    .matches(/^[a-z ,.'-éëèçêïü]+$/i, {
      message: { gemeente: 'Kan enkel letters bevatten' },
    }),
  postcode: number()
    .required({ postcode: 'verplicht veld' })
    .typeError({ postcode: 'Kan enkel cijfers bevatten' }),
  honden: array(
    object({
      ras: string().test('is-set', '${path} verplicht', function (item) {
        return item
          ? true
          : this.createError({
              path: `${this.path}`,
              message: { [this.path]: 'verplicht' },
            });
      }),
      naam: string().test('matches', '${path} matches', function (item) {
        if (!item)
          return this.createError({
            path: `${this.path}`,
            message: { [this.path]: 'verplicht' },
          });
        if (item.match(/[0-9&|@"#()§^!{}°$[\]%£´`+=~/:;.?,><\\]/))
          return this.createError({
            path: `${this.path}`,
            message: { [this.path]: 'enkel letters' },
          });
        return true;
      }),
      // .required({ naam: "Naam is required" })
      // .matches(/^[a-z ,.'-éëèçêïü]+$/i, {
      //   message: { honden: "Kan enkel letters bevatten" },
      // }),
      geboortedatum: date().test('is-set', '${path} verplicht', function (item) {
        return item
          ? true
          : this.createError({
              path: `${this.path}`,
              message: { [this.path]: 'verplicht' },
            });
      }),
      // chip_nr: string().optional().default(""),
      geslacht: string().test('is-set', '${path} verplicht', function (item) {
        return item
          ? true
          : this.createError({
              path: `${this.path}`,
              message: { [this.path]: 'verplicht' },
            });
      }),
    })
  ),
});

const inschrijving = object({
  inschrijvingen: array(
    object({
      datum: date().required({ message: 'Ongeldige datum' }),
      hond_id: string().required(),
      hond_naam: string().required(),
      hond_geslacht: string().optional(),
      // tijdslot: string().required("Gelieve een tijdslot aan te duiden"),
    })
  )
    .required({ message: 'Geen datum geselecteerd' })
    .min(1, 'Gelieve minstens 1 tijdstip aan te duiden'),
  training: string().required({ message: 'Ongeldige training' }),
  klant_id: string().optional().nullable(),
});

const boeking = object({
  csrf: string().required({ failure: 'Invalid form' }),
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
  ).required({ details: 'Gelieve minstens 1 hond op te geven' }),
});

const contact = object({
  naam: string().required({ naam: 'verplicht', message: 'Gelieve een naam op te geven' }),
  email: string()
    .email({ email: 'Ongeldige email' })
    .required({ message: 'Gelieve een email-adres op te geven', email: 'verplicht' }),
  gsm: string()
    .matches(/[^a-z,A-Z]/, {
      message: {
        gsm: 'invalid format',
        message: 'Gsm-veld mag geen letters bevatten',
      },
    })
    .required({
      message: 'Gelieve een contact-nummer op te geven',
      gsm: 'verplicht',
    }),
  bericht: string()
    .required({ message: 'Gelieve een bericht na te laten', bericht: 'verplicht' })
    .min(5, { bericht: 'Dit bericht is helaas te kort' }),
});

const schemas = {
  login,
  register,
  inschrijving,
  boeking,
  contact,
};

export const {
  login: loginSchema,
  register: registerSchema,
  inschrijving: inschrijvingSchema,
  boeking: boekingSchema,
  contact: contactSchema,
} = schemas;
