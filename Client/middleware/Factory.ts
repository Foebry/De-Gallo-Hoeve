import moment from "moment";
import { ObjectId } from "mongodb";
import ConfirmController, {
  CONFIRM,
  ConfirmCollection,
  IsConfirmController,
  NewConfirm,
} from "../controllers/ConfirmController";
import ContentController, {
  CONTENT,
  IsContentController,
} from "../controllers/ContentController";
import HondController, {
  HOND,
  HondCollection,
  IsHondController,
} from "../controllers/HondController";
import InschrijvingController, {
  InschrijvingCollection,
  IsInschrijving,
  IsInschrijvingController,
} from "../controllers/InschrijvingController";
import KlantController, {
  IsKlantController,
  KLANT,
  KlantCollection,
  NewKlant,
} from "../controllers/KlantController";
import RasController, {
  IsRasController,
  RAS,
} from "../controllers/rasController";
import TrainingController, {
  IsTrainingController,
  TRAINING,
  TrainingType,
} from "../controllers/TrainingController";
import { INSCHRIJVING } from "../types/linkTypes";

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
    klant: KlantCollection,
    hond: HondCollection
  ): InschrijvingCollection => ({
    ...inschrijving,
    training,
    klant: { id: klant._id, lnaam: klant.lnaam, vnaam: klant.vnaam },
    hond: { id: hond._id, naam: hond.naam },
    _id: new ObjectId(),
    created_at: moment().local().format(),
  }),
  createConfirm: (confirm: NewConfirm): ConfirmCollection => ({
    ...confirm,
    _id: new ObjectId(),
    code: Math.random().toString(32).substring(2),
  }),
  createHond: () => {},
  createKlant: (klant: NewKlant): KlantCollection => ({
    ...klant,
    _id: new ObjectId(),
    roles: "[]",
    created_at: moment().local().format(),
    inschrijvingen: [],
    reservaties: [],
    verified: false,
  }),
  createRas: () => {},
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
