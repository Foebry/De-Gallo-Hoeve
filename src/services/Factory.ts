import moment from "moment";
import { ObjectId } from "mongodb";
import ConfirmController, {
  IsConfirmController,
} from "../controllers/ConfirmController";
import ContentController, {
  CONTENT,
  IsContentController,
} from "../controllers/ContentController";
import HondController, {
  HOND,
  IsHondController,
} from "../controllers/HondController";
import InschrijvingController, {
  INSCHRIJVING,
  IsInschrijvingController,
} from "../controllers/InschrijvingController";
import KlantController, {
  IsKlantController,
  KLANT,
} from "../controllers/KlantController";
import RasController, {
  IsRasController,
  RAS,
} from "../controllers/rasController";
import TrainingController, {
  IsTrainingController,
  TRAINING,
} from "../controllers/TrainingController";
import { IsKlantCollection } from "../types/EntityTpes/KlantTypes";
import {
  IsInschrijvingBodyInschrijving,
  IsNewKlantData,
} from "../types/requestTypes";
import brcypt from "bcrypt";
import {
  capitalize,
  createRandomConfirmCode,
  getCurrentTime,
  toLocalTime,
} from "../shared/functions";
import { HondCollection, NewHond } from "../types/EntityTpes/HondTypes";
import {
  CONFIRM,
  ConfirmCollection,
  NewConfirm,
} from "../types/EntityTpes/ConfirmTypes";
import { InschrijvingCollection } from "../types/EntityTpes/InschrijvingTypes";
import {
  PriveTrainingCollection,
  TrainingType,
} from "../types/EntityTpes/TrainingType";
import { NewRas, RasCollection } from "../types/EntityTpes/RasTypes";
import axios from "axios";
import { IsRegisterPayload } from "tests/auth/types";
import {
  closeClient,
  getConfirmCollection,
  getInschrijvingCollection,
  getTrainingCollection,
} from "src/utils/db";
import errorLogController, {
  ErrorLogController,
} from "src/controllers/ErrorLogController";
import { ERRORLOG } from "../types/EntityTpes/ErrorLogTypes";

export type CONFIRM = "ConfirmController";
export type CONTENT = "ContentController";
export type HOND = "HondController";
export type INSCHRIJVING = "InschrijvingController";
export type KLANT = "KlantController";
export type RAS = "RasController";
export type TRAINING = "TrainingController";
export type ERRORLOG = "ErrorLogController";

const createInschrijving = (
  inschrijving: IsInschrijvingBodyInschrijving,
  training: TrainingType,
  klant: IsKlantCollection,
  hond: HondCollection
): InschrijvingCollection => ({
  datum: new Date(inschrijving.datum),
  training,
  klant: { id: klant._id, lnaam: klant.lnaam, vnaam: klant.vnaam },
  hond: { id: hond._id, naam: hond.naam },
  _id: new ObjectId(),
  created_at: getCurrentTime(),
  updated_at: getCurrentTime(),
});

const createConfirm = (confirm: NewConfirm): ConfirmCollection => ({
  ...confirm,
  _id: new ObjectId(),
  code: createRandomConfirmCode(),
  valid_to: moment(confirm.created_at).local().add(1, "day").toDate(),
});

const createHond = (hond: NewHond) => ({
  _id: new ObjectId(),
  naam: capitalize(hond.naam),
  geslacht: hond.geslacht,
  // geboortedatum: moment(hond.geboortedatum).local().toDate(),
  geboortedatum: toLocalTime(hond.geboortedatum),
  ras: hond.ras,
  created_at: getCurrentTime(),
  updated_at: getCurrentTime(),
});

const createKlant = async (
  klant: IsNewKlantData
): Promise<IsKlantCollection> => ({
  _id: new ObjectId(),
  roles: "0",
  verified: false,
  inschrijvingen: [],
  reservaties: [],
  created_at: getCurrentTime(),
  updated_at: getCurrentTime(),
  email: klant.email.toLowerCase(),
  password: await brcypt.hash(klant.password, 10),
  vnaam: capitalize(klant.vnaam),
  lnaam: capitalize(klant.lnaam),
  gsm: klant.gsm,
  straat: capitalize(klant.straat),
  nr: klant.nr,
  bus: klant.bus,
  gemeente: capitalize(klant.gemeente),
  postcode: klant.postcode,
  honden: klant.honden.map((hond) => createHond(hond)),
});

const createRas = (ras: NewRas): RasCollection => ({
  _id: new ObjectId(),
  naam: ras.naam,
  soort: ras.soort,
  created_at: getCurrentTime(),
  updated_at: getCurrentTime(),
});

export const createRandomKlant = async (
  options?: any
): Promise<IsRegisterPayload> => {
  await process.nextTick(() => {});
  const { data } = await axios.get(
    "https://www.randomuser.me/api/?format=json&nat=fr"
  );
  const randomKlant = {
    _id: new ObjectId(),
    roles: "",
    created_at: moment().local().format(),
    email: data.results[0].email,
    gemeente: data.results[0].location.city,
    gsm: data.results[0].phone,
    honden: [],
    inschrijvingen: [],
    lnaam: data.results[0].name.last,
    nr: data.results[0].location.street.number,
    password: "aBcDeFgH1!",
    postcode: Math.floor(Math.random() * 100000),
    reservaties: [],
    straat: data.results[0].location.street.name,
    updated_at: moment().local().format(),
    verified: false,
    vnaam: data.results[0].name.first,
    bus: data.results[0].location.street.bus ?? null,
    ...options,
  };
  return {
    ...randomKlant,
    save: async (): Promise<IsKlantCollection> => {
      const klant = {
        ...randomKlant,
        password: await brcypt.hash(randomKlant.password, 10),
      };
      const savedKlant = await Factory.getController(KLANT).save(klant);
      return savedKlant;
    },
  };
};

export const createRandomHond = async (): Promise<HondCollection> => {
  // await process.nextTick(() => {});
  const { data } = await axios.get(
    "https://www.randomuser.me/api/?format=json&nat=fr"
  );
  const now = moment().local().toDate();
  return {
    geslacht: data.results[0].gender === "female" ? "Teef" : "Reu",
    geboortedatum: data.results[0].dob.date,
    naam: data.results[0].name.first,
    ras: "labrador retriever",
    _id: new ObjectId(),
    created_at: now,
    updated_at: now,
  };
};

export const createRandomInschrijving = (
  klant: IsKlantCollection,
  hond: HondCollection
): RandomInschrijving => {
  const now = moment().local().toDate();
  const randomInschrijving = {
    _id: new ObjectId(),
    created_at: now,
    datum: moment("2022-09-24").local().toDate(),
    hond: { id: hond._id, naam: hond.naam },
    klant: { id: klant._id, vnaam: klant.vnaam, lnaam: klant.lnaam },
    training: "prive" as TrainingType,
    updated_at: now,
  };
  return {
    ...randomInschrijving,
    save: async () => {
      const collection = await getInschrijvingCollection();
      await collection.insertOne(randomInschrijving);
      return randomInschrijving;
    },
  };
};

export const createRandomTraining = (naam: string): RandomTraining => {
  const currentTime = getCurrentTime();
  const randomTraining = {
    _id: new ObjectId(),
    naam: naam as TrainingType,
    prijs: Math.round(Math.random() * 20),
    inschrijvingen: [] as ObjectId[],
    bullets: [],
    content: "",
    default_content: [],
    image: "",
    subtitle: "Random training",
    prijsExcl: 20.66,
    gratisVerplaatsingBinnen: 10,
    kmHeffing: 0.3,
    created_at: currentTime,
    updated_at: currentTime,
  } as PriveTrainingCollection;
  return {
    ...randomTraining,
    save: async () => {
      const collection = await getTrainingCollection();
      await collection.insertOne(randomTraining);
      return randomTraining;
    },
  };
};

export const createRandomConfirm = (
  klant?: IsKlantCollection
): ConfirmCollection => ({
  _id: new ObjectId(),
  code: createRandomConfirmCode(),
  created_at: getCurrentTime(),
  klant_id: klant?._id ?? new ObjectId(),
  valid_to: toLocalTime(moment(getCurrentTime()).add(1, "hour").format()),
});

const Factory = {
  createRandomTraining,
  createRandomInschrijving,
  createRandomHond,
  createRandomKlant,
  createRandomConfirm,
  createRas,
  createKlant,
  createHond,
  createConfirm,
  createInschrijving,
  getController,
};

export type ControllerType =
  | CONFIRM
  | CONTENT
  | HOND
  | INSCHRIJVING
  | KLANT
  | RAS
  | TRAINING
  | ERRORLOG;

export type PaginatedControllerType = HOND | INSCHRIJVING | KLANT | RAS;

export function getController(type: CONFIRM): IsConfirmController;
export function getController(type: CONTENT): IsContentController;
export function getController(type: HOND): IsHondController;
export function getController(type: INSCHRIJVING): IsInschrijvingController;
export function getController(type: KLANT): IsKlantController;
export function getController(type: RAS): IsRasController;
export function getController(type: TRAINING): IsTrainingController;
export function getController(type: ERRORLOG): ErrorLogController;
export function getController(type: ControllerType) {
  return type === CONFIRM
    ? ConfirmController
    : type === CONTENT
    ? ContentController
    : type === HOND
    ? HondController
    : type === INSCHRIJVING
    ? InschrijvingController
    : type === KLANT
    ? KlantController
    : type === RAS
    ? RasController
    : type === ERRORLOG
    ? errorLogController
    : TrainingController;
}
export default Factory;
const cascadeOptions = {
  CASCADEFULL: "CASCADEFULL",
  CASCADEKLANT: "CASCADEKLANT",
  CASCADETRAINING: "CASCADETRAINING",
};
export const { CASCADEFULL, CASCADEKLANT, CASCADETRAINING } = cascadeOptions;

interface RandomInschrijving extends InschrijvingCollection {
  save: () => Promise<InschrijvingCollection>;
}
interface RandomTraining extends PriveTrainingCollection {
  save: () => Promise<PriveTrainingCollection>;
}

interface RandomConfrm extends ConfirmCollection {
  save: () => Promise<ConfirmCollection>;
}
