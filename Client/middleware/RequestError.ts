export class HttpError extends Error {
  response: any;
  constructor(name: string, message: string, response: any) {
    super(name);
    this.name = name;
    this.message = message;
    this.response = { ...response, message } ?? { message };
  }
}

export class BadRequestError extends HttpError {
  code: number;
  constructor(name: string, message: string, response: any) {
    super(name, message, response);
    this.code = 400;
  }
}

export class ValidationError extends BadRequestError {
  constructor(response: any) {
    super("ValidationError", "Kan verzoek niet verwerken", response);
  }
}

export class InschrijvingKlantChangedError extends BadRequestError {
  constructor(response?: any) {
    super("InschrijvingKlantChangedError", "Kan klant niet wijzigen", response);
  }
}

export class EntityNotFoundError extends HttpError {
  code: number;
  constructor(name: string, message: string, response?: any) {
    super(name, message, response);
    this.code = 404;
  }
}

export class InvalidConfirmCodeError extends EntityNotFoundError {
  constructor() {
    super("InvalidConfirmCodeError", "Code niet gevonden");
  }
}

export class KlantNotFoundError extends EntityNotFoundError {
  constructor(response?: any) {
    super("KlantNotFoundError", "Klant niet gevonden", response);
  }
}

export class TrainingNotFoundError extends EntityNotFoundError {
  constructor() {
    super("TrainingNotFoundError", "Training niet gevonden");
  }
}

export class HondNotFoundError extends EntityNotFoundError {
  constructor() {
    super("HondNotFoundError", "Hond niet gevonden");
  }
}

export class ContentNotFoundError extends EntityNotFoundError {
  constructor() {
    super("ContentNotFoundError", "Content niet gevonden");
  }
}

export class ConfirmNotFoundError extends EntityNotFoundError {
  constructor() {
    super("ConfirmNotFoundError", "Confirm niet gevonden");
  }
}

export class InschrijvingNotFoundError extends EntityNotFoundError {
  constructor() {
    super("InschrijvingNotFoundError", "Inschrijving niet gevonden");
  }
}

export class RasNotFoundError extends EntityNotFoundError {
  constructor() {
    super("RasNotFoundError", "Ras niet gevonden");
  }
}

export class UnprocessablePayloadError extends HttpError {
  code: number;
  constructor(name: string, message: string, response?: any) {
    super(name, message, response);
    this.code = 422;
  }
}

export class EmailOccupiedError extends UnprocessablePayloadError {
  constructor() {
    super("EmailOccupiedError", "Kan registratie niet verwerken", {
      email: "Email reeds in gebruik",
    });
  }
}

export class InvalidEmailError extends UnprocessablePayloadError {
  constructor() {
    super("UnrecognizedEmailError", "Kan verzoek niet verwerken", {
      email: "Onbekende email",
    });
  }
}

export class InvalidPasswordError extends UnprocessablePayloadError {
  constructor() {
    super("InvalidPasswordError", "Kan verzoek niet verwerken", {
      password: "Ongeldig wachtwoord",
    });
  }
}

export class ReedsIngeschrevenError extends UnprocessablePayloadError {
  constructor() {
    super(
      "ReedsIngeschrevenError",
      "U bent reeds ingeschreven voor deze training"
    );
  }
}

export class TrainingVolzetError extends UnprocessablePayloadError {
  constructor(message: string) {
    super("TrainingVolzetError", message);
  }
}

export class AuthorizationError extends HttpError {
  code: number;
  constructor(name: string, message: string, response?: any) {
    super(name, message, response);
    this.code = 401;
  }
}

export class UnauthorizedAccessError extends AuthorizationError {
  constructor() {
    super("UnauthorizedAccessError", "Niet Toegestaan");
  }
}

export class EmailNotVerifiedError extends AuthorizationError {
  constructor() {
    super("EmailNotVerifiedError", "Gelieve uw email te verifiëren");
  }
}

export class NotLoggedInError extends AuthorizationError {
  constructor() {
    super("NotLoggedInError", "Not Logged In");
    this.code = 403;
    // destroyCookie({ res }, "Client", {
    //   httpOnly: false,
    //   maxAge: 3600,
    //   secure: false,
    //   sameSite: "strict",
    //   path: "/",
    // });
    // res.status(401).json({ code: 401, message: "Unauthorized Access" });
  }
}

export class NotAllowedError extends HttpError {
  code: number;
  constructor() {
    super("NotAllowedError", "Not Allowed", {});
    this.code = 405;
  }
}

export class InternalServerError extends HttpError {
  code: number;
  constructor() {
    super("InternalServerError", "Internal Server Error", {});
    this.code = 500;
  }
}
