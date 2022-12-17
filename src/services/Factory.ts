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
import {
  IsInschrijvingBodyInschrijving,
  IsNewKlantData,
} from "../types/requestTypes";
import brcypt from "bcrypt";
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
import { IsRegisterPayload } from "../../tests/auth/types";
import { getConnection } from "../utils/MongoDb";
import { capitalize, createRandomConfirmCode } from "src/shared/functions";

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
  }),
  createConfirm: (confirm: NewConfirm): ConfirmCollection => ({
    ...confirm,
    _id: new ObjectId(),
    code: createRandomConfirmCode(),
    valid_to: moment(confirm.created_at).local().add(1, "day").toDate(),
  }),
  createHond: (hond: NewHond) => ({
    _id: new ObjectId(),
    naam: capitalize(hond.naam),
    geslacht: hond.geslacht,
    geboortedatum: moment(hond.geboortedatum).local().toDate(),
    ras: hond.ras,
    created_at: getCurrentTime(),
    updated_at: getCurrentTime(),
  }),
  createKlant: async (klant: IsNewKlantData): Promise<IsKlantCollection> => ({
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
  }),
  createRas: (ras: NewRas): RasCollection => ({
    _id: new ObjectId(),
    naam: ras.naam,
    soort: ras.soort,
    created_at: getCurrentTime(),
    updated_at: getCurrentTime(),
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
        const klant = {
          ...randomKlant,
          password: await brcypt.hash(randomKlant.password, 10),
        };
        const savedKlant = await Factory.getController(KLANT).save(klant);
        return savedKlant;
      },
    };
  },
  createRandomHond: async (): Promise<HondCollection> => {
    await process.nextTick(() => {});
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
  },

  createRandomInschrijving: (
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
        const inschrijvingCollection = await getInschrijvingCollection();
        await inschrijvingCollection.insertOne(randomInschrijving);
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
      bullets: [],
      content: "",
      default_content: [],
      image: "",
      subtitle: "Random training",
      prijsExcl: 20.66,
      gratisVerplaatsingBinnen: 10,
      kmHeffing: 0.3,
    } as PriveTrainingCollection;
    return {
      ...randomTraining,
      save: async () => {
        const trainingCollection = await getTrainingCollection();
        await process.nextTick(() => {});
        await trainingCollection.insertOne(randomTraining);
        return randomTraining;
      },
    };
  },
};

export type ControllerType =
  | CONFIRM
  | CONTENT
  | HOND
  | INSCHRIJVING
  | KLANT
  | RAS
  | TRAINING;

export type PaginatedControllerType = HOND | INSCHRIJVING | KLANT | RAS;

function getController(type: CONFIRM): IsConfirmController;
function getController(type: CONTENT): IsContentController;
function getController(type: HOND): IsHondController;
function getController(type: INSCHRIJVING): IsInschrijvingController;
function getController(type: KLANT): IsKlantController;
function getController(type: RAS): IsRasController;
function getController(type: TRAINING): IsTrainingController;
function getController(type: ControllerType) {
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
    : TrainingController;
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

const getCurrentTime = () => {
  const currentMoment = moment().format("YYYY-MM-DD HH:mm:ss");
  return new Date(moment.utc(currentMoment).local().toString());
};
