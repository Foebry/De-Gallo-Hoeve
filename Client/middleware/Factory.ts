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
  getInschrijvingCollection,
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
  getTrainingCollection,
  IsTrainingController,
  TRAINING,
} from "../controllers/TrainingController";
import { IsKlantCollection } from "../types/EntityTpes/KlantTypes";
import { IsNewKlantData } from "../types/requestTypes";
import brcypt from "bcrypt";
import { capitalize, createRandomConfirmCode } from "./Helper";
import { HondCollection, NewHond } from "../types/EntityTpes/HondTypes";
import {
  CONFIRM,
  ConfirmCollection,
  NewConfirm,
} from "../types/EntityTpes/ConfirmTypes";
import {
  InschrijvingCollection,
  IsInschrijving,
} from "../types/EntityTpes/InschrijvingTypes";
import {
  PriveTrainingCollection,
  TrainingType,
} from "../types/EntityTpes/TrainingType";
import { NewRas, RasCollection } from "../types/EntityTpes/RasTypes";
import axios from "axios";
import { IsRegisterPayload } from "../tests/auth/types";
import client from "./MongoDb";

export type CONFIRM = "ConfirmController";
export type CONTENT = "ContentController";
export type HOND = "HondController";
export type INSCHRIJVING = "InschrijvingController";
export type KLANT = "KlantController";
export type RAS = "RasController";
export type TRAINING = "TrainingController";

const Factory = {
  getController,
  createInschrijving: (
    inschrijving: IsInschrijving,
    training: TrainingType,
    klant: IsKlantCollection,
    hond: HondCollection
  ): InschrijvingCollection => ({
    datum: moment(inschrijving.datum).local().format(),
    training,
    klant: { id: klant._id, lnaam: klant.lnaam, vnaam: klant.vnaam },
    hond: { id: hond._id, naam: hond.naam },
    _id: new ObjectId(),
    created_at: moment().local().format(),
    updated_at: moment().local().format(),
  }),
  createConfirm: (confirm: NewConfirm): ConfirmCollection => ({
    ...confirm,
    _id: new ObjectId(),
    code: createRandomConfirmCode(),
    valid_to: moment(confirm.created_at).local().add(1, "day").format(),
  }),
  createHond: (hond: NewHond) => ({
    _id: new ObjectId(),
    naam: capitalize(hond.naam),
    geslacht: hond.geslacht,
    geboortedatum: moment().local().format(),
    ras: hond.ras,
    created_at: moment().local().format(),
    updated_at: moment().local().format(),
  }),
  createKlant: async (klant: IsNewKlantData): Promise<IsKlantCollection> => ({
    _id: new ObjectId(),
    roles: "",
    verified: false,
    inschrijvingen: [],
    reservaties: [],
    created_at: moment().local().format(),
    updated_at: moment().local().format(),
    email: klant.email.toLowerCase(),
    password: await brcypt.hash(klant.password, 10),
    vnaam: capitalize(klant.vnaam),
    lnaam: capitalize(klant.lnaam),
    gsm: klant.gsm,
    straat: capitalize(klant.straat),
    nr: 0,
    bus: klant.bus,
    gemeente: capitalize(klant.gemeente),
    postcode: 0,
    honden: klant.honden.map((hond) => createHond(hond)),
  }),
  createRas: (ras: NewRas): RasCollection => ({
    _id: new ObjectId(),
    naam: ras.naam,
    soort: ras.soort,
    created_at: moment().local().format(),
    updated_at: moment().local().format(),
  }),
  createRandomKlant: async (options?: any): Promise<IsRegisterPayload> => {
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
        await client.connect();
        const klant = {
          ...randomKlant,
          password: await brcypt.hash(randomKlant.password, 10),
        };
        const savedKlant = await Factory.getController(KLANT).save(klant);
        await client.close();
        return savedKlant;
      },
    };
  },
  createRandomHond: async (): Promise<HondCollection> => {
    await process.nextTick(() => {});
    const { data } = await axios.get(
      "https://www.randomuser.me/api/?format=json&nat=fr"
    );
    const now = moment().local().format();
    return {
      geslacht: data.results[0].gender === "female" ? "Teef" : "Reu",
      geboortedatum: data.results[0].dob.date,
      naam: data.results[0].name.first,
      ras: "labrador retriever",
      _id: new ObjectId(),
      created_at: now,
      updated_at: now,
    };
  },

  createRandomInschrijving: (
    klant: IsKlantCollection,
    hond: HondCollection
  ): RandomInschrijving => {
    const randomInschrijving = {
      _id: new ObjectId(),
      created_at: moment().local().format(),
      datum: moment("2022-09-24").local().format(),
      hond: { id: hond._id, naam: hond.naam },
      klant: { id: klant._id, vnaam: klant.vnaam, lnaam: klant.lnaam },
      training: "prive" as TrainingType,
      updated_at: moment().local().format(),
    };
    return {
      ...randomInschrijving,
      save: async () => {
        await client.connect();
        await getInschrijvingCollection().insertOne(randomInschrijving);
        await client.close();
        return randomInschrijving;
      },
    };
  },

  createRandomTraining: (naam: string): RandomTraining => {
    const randomTraining = {
      _id: new ObjectId(),
      naam: naam as TrainingType,
      prijs: Math.round(Math.random() * 20),
      inschrijvingen: [] as ObjectId[],
    };
    return {
      ...randomTraining,
      save: async () => {
        await process.nextTick(() => {});
        await client.connect();
        await getTrainingCollection().insertOne(randomTraining);
        await client.close();
        return randomTraining;
      },
    };
  },
};

function getController(type: CONFIRM): IsConfirmController;
function getController(type: CONTENT): IsContentController;
function getController(type: HOND): IsHondController;
function getController(type: INSCHRIJVING): IsInschrijvingController;
function getController(type: KLANT): IsKlantController;
function getController(type: RAS): IsRasController;
function getController(type: TRAINING): IsTrainingController;
function getController(
  type: CONFIRM | CONTENT | HOND | INSCHRIJVING | KLANT | RAS | TRAINING
) {
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
    : type === TRAINING
    ? TrainingController
    : null;
}
export default Factory;
const cascadeOptions = {
  CASCADEFULL: "CASCADEFULL",
  CASCADEKLANT: "CASCADEKLANT",
  CASCADETRAINING: "CASCADETRAINING",
};
export const { CASCADEFULL, CASCADEKLANT, CASCADETRAINING } = cascadeOptions;
export const { createHond } = Factory;

interface RandomInschrijving extends InschrijvingCollection {
  save: () => Promise<InschrijvingCollection>;
}
interface RandomTraining extends PriveTrainingCollection {
  save: () => Promise<PriveTrainingCollection>;
}
