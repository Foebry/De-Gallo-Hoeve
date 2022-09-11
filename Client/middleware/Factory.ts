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
import { INSCHRIJVING } from "../types/linkTypes";
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
import inschrijving from "../pages/inschrijving";
import { TrainingType } from "../types/EntityTpes/TrainingType";
import { NewRas, RasCollection } from "../types/EntityTpes/RasTypes";

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
