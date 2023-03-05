import moment from 'moment';
import { ObjectId } from 'mongodb';
import ConfirmController, { IsConfirmController } from '../controllers/ConfirmController';
import ContentController, {
  CONTENT,
  IsContentController,
} from '../controllers/ContentController';
import HondController, { HOND, IsHondController } from '../controllers/HondController';
import InschrijvingController, {
  INSCHRIJVING,
  IsInschrijvingController,
} from '../controllers/InschrijvingController';
import KlantController, {
  IsKlantController,
  KLANT,
} from '../controllers/KlantController';
import RasController, { IsRasController, RAS } from '../controllers/rasController';
import TrainingController, {
  IsTrainingController,
  TRAINING,
} from '../controllers/TrainingController';
import { IsKlantCollection } from '../types/EntityTpes/KlantTypes';
import { IsInschrijvingBodyInschrijving, IsNewKlantData } from '../types/requestTypes';
import brcypt from 'bcrypt';
import { capitalize, getCurrentTime, toLocalTime } from '../shared/functions';
import { HondCollection, NewHond } from '../types/EntityTpes/HondTypes';
import { CONFIRM, ConfirmCollection, NewConfirm } from '../types/EntityTpes/ConfirmTypes';
import { InschrijvingCollection } from '../types/EntityTpes/InschrijvingTypes';
import {
  PriveTrainingCollection,
  TrainingDaysCollection,
  TrainingType,
} from '../types/EntityTpes/TrainingType';
import { NewRas, RasCollection } from '../types/EntityTpes/RasTypes';
import { ERRORLOG } from '../types/EntityTpes/ErrorLogTypes';
import TrainingDayController, {
  IsTrainingDayController,
  TRAININGDAY,
} from 'src/controllers/TrainingDayController';
import { TrainingDayDto } from '@/types/DtoTypes/TrainingDto';
import { createRandomConfirmCode } from 'src/pages/api/confirm/[code]/repo';

export type CONFIRM = 'ConfirmController';
export type CONTENT = 'ContentController';
export type HOND = 'HondController';
export type INSCHRIJVING = 'InschrijvingController';
export type KLANT = 'KlantController';
export type RAS = 'RasController';
export type TRAINING = 'TrainingController';
export type TRAININGDAY = 'TrainingDayController';
export type ERRORLOG = 'ErrorLogController';

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
  code: createRandomConfirmCode(confirm.klant_id),
  valid_to: moment(confirm.created_at).local().add(1, 'day').toDate(),
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

const createKlant = async (klant: IsNewKlantData): Promise<IsKlantCollection> => ({
  _id: new ObjectId(),
  roles: '0',
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
});

export const createTrainingDay = (
  trainingDayDto: TrainingDayDto
): TrainingDaysCollection => ({
  _id: new ObjectId(),
  created_at: getCurrentTime(),
  date: new Date(trainingDayDto.date),
  timeslots: trainingDayDto.timeslots,
  updated_at: getCurrentTime(),
});

const Factory = {
  createRas,
  createKlant,
  createHond,
  createConfirm,
  createInschrijving,
  createTrainingDay,
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
  | TRAININGDAY
  | ERRORLOG;

export type PaginatedControllerType = HOND | INSCHRIJVING | KLANT | RAS;

export function getController(type: CONFIRM): IsConfirmController;
export function getController(type: CONTENT): IsContentController;
export function getController(type: HOND): IsHondController;
export function getController(type: INSCHRIJVING): IsInschrijvingController;
export function getController(type: KLANT): IsKlantController;
export function getController(type: RAS): IsRasController;
export function getController(type: TRAINING): IsTrainingController;
export function getController(type: TRAININGDAY): IsTrainingDayController;
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
    : type === TRAININGDAY
    ? TrainingDayController
    : TrainingController;
}
export default Factory;
const cascadeOptions = {
  CASCADEFULL: 'CASCADEFULL',
  CASCADEKLANT: 'CASCADEKLANT',
  CASCADETRAINING: 'CASCADETRAINING',
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
