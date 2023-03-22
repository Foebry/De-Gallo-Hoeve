import { FrontEndErrorCodes } from './functions';

export class HttpError extends Error {
  response: any;
  code: number;
  constructor(name: string, message: string, response: any, code: number) {
    super(name);
    this.name = name;
    this.message = message;
    this.code = code;
    this.response = { message, errorCode: this.name, ...response, code: this.code };
  }
}

export class TransactionError extends HttpError {
  constructor(name: string, code: number, response: any) {
    super(name, '', response, code);
  }
}

export class BadRequestError extends HttpError {
  constructor(name: string, message: string, response?: any) {
    super(name, message, { errorCode: name, ...response }, 400);
  }
}

export class ValidationError extends BadRequestError {
  constructor(message?: any, response?: any) {
    super('ValidationError', message, response);
  }
}

export class InschrijvingKlantChangedError extends BadRequestError {
  constructor(response?: any) {
    super('InschrijvingKlantChangedError', 'Kan klant niet wijzigen', response);
  }
}

export class InvalidCsrfError extends BadRequestError {
  constructor() {
    super('InvalidCsrfError', 'Er is iets fout gegaan, probeer later opnieuw...');
  }
}

export class InvalidConfirmCodeFormat extends BadRequestError {
  constructor() {
    super('InvalidConfirmCodeFormat', 'invalid confirm code');
  }
}

export class EntityNotFoundError extends HttpError {
  constructor(name: string, message: string, response?: any) {
    super(name, message, response, 404);
  }
}

export class InvalidConfirmCodeError extends EntityNotFoundError {
  constructor() {
    super('InvalidConfirmCodeError', 'Code niet gevonden');
  }
}

export class LinkExpiredError extends EntityNotFoundError {
  constructor() {
    super('LinkExpiredError', 'Deze link is niet meer gelding');
  }
}

export class KlantNotFoundError extends EntityNotFoundError {
  constructor(response?: any) {
    super('KlantNotFoundError', 'Klant niet gevonden', response);
  }
}

export class TrainingNotFoundError extends EntityNotFoundError {
  constructor() {
    super('TrainingNotFoundError', 'Training niet gevonden');
  }
}

export class HondNotFoundError extends EntityNotFoundError {
  constructor() {
    super('HondNotFoundError', 'Hond niet gevonden');
  }
}

export class ContentNotFoundError extends EntityNotFoundError {
  constructor() {
    super('ContentNotFoundError', 'Content niet gevonden');
  }
}

export class ConfirmNotFoundError extends EntityNotFoundError {
  constructor() {
    super('ConfirmNotFoundError', 'Confirm niet gevonden');
  }
}

export class InschrijvingNotFoundError extends EntityNotFoundError {
  constructor() {
    super('InschrijvingNotFoundError', 'Inschrijving niet gevonden');
  }
}

export class RasNotFoundError extends EntityNotFoundError {
  constructor() {
    super('RasNotFoundError', 'Ras niet gevonden');
  }
}

export class ExpiredConfirmCodeError extends EntityNotFoundError {
  constructor() {
    super('ExpiredConfirmCodeError', 'Confirm code expired');
  }
}

export class UnprocessablePayloadError extends HttpError {
  constructor(name: string, message: string, response?: any) {
    super(name, message, response, 422);
  }
}

export class EmailOccupiedError extends UnprocessablePayloadError {
  constructor() {
    super('EmailOccupiedError', 'Kan registratie niet verwerken', {
      email: 'Email reeds in gebruik',
    });
  }
}

export class InvalidEmailError extends UnprocessablePayloadError {
  constructor() {
    super('UnrecognizedEmailError', 'Kan verzoek niet verwerken', {
      email: 'Onbekende email',
    });
  }
}

export class InvalidPasswordError extends UnprocessablePayloadError {
  constructor() {
    super('InvalidPasswordError', 'Kan verzoek niet verwerken', {
      password: 'Ongeldig wachtwoord',
    });
  }
}

export class ReedsIngeschrevenError extends UnprocessablePayloadError {
  constructor(index: number) {
    super('ReedsIngeschrevenError', 'Inschrijving niet verwerkt', {
      [`inschrijvingen[${index}][timeslot]`]:
        'U bent reeds ingeschreven voor deze training',
      message: 'Inschrijving niet verwerkt',
    });
  }
}

export class TrainingVolzetError extends UnprocessablePayloadError {
  constructor() {
    super('TrainingVolzetError', 'Dit tijdstip is niet meer vrij');
  }
}

export class AuthorizationError extends HttpError {
  constructor(name: string, message: string, response: any, code: number) {
    super(name, message, response, code);
  }
}

export class UnauthorizedAccessError extends AuthorizationError {
  constructor(response?: any) {
    super('UnauthorizedAccessError', 'Niet Toegestaan', response, 401);
  }
}

export class EmailNotVerifiedError extends AuthorizationError {
  constructor(response?: any) {
    super('EmailNotVerifiedError', 'Gelieve uw email te verifiëren', response, 403);
  }
}

export class NotLoggedInError extends AuthorizationError {
  constructor() {
    super('NotLoggedInError', 'Not Logged In', {}, 403);
  }
}

export class NotAllowedError extends HttpError {
  constructor() {
    super('NotAllowedError', 'Not Allowed', {}, 405);
  }
}

export class InternalServerError extends HttpError {
  constructor() {
    super('InternalServerError', 'Internal Server Error', {}, 500);
  }
}

export class ConflictError extends HttpError {
  constructor(name: string, message: string, response?: any) {
    super(name, message, response, 409);
  }
}

export class ConfirmationNeededError extends ConflictError {
  constructor(response?: Record<string, any>) {
    super('ConfirmationNeededError', 'Confirmation is needed', response);
  }
}

export class KlantAlreadyVerifiedError extends ConflictError {
  constructor() {
    super('KlantAlreadyVerifiedError', 'U bent reeds geverifiëerd', {
      errorCode: FrontEndErrorCodes.KlantAlreadyVerified,
    });
  }
}

export class LinkAlreadyUsedError extends ConflictError {
  constructor() {
    super('LinkAlreadyUsedError', 'Deze link is niet meer geldig');
  }
}
