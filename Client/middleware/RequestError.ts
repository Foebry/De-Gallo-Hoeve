import { NextApiResponse } from "next";
import { destroyCookie } from "nookies";

export class BadRequestError extends Error {
  constructor(res: NextApiResponse) {
    super("Bad Request");
    this.name = "BadRequestError";
    res.status(400).json({ message: "Bad Request" });
  }
}

export class NotFoundError extends Error {
  constructor(res: NextApiResponse, message: string, data?: {}) {
    super("Not Found");
    this.name = "Not Found Error";
    res.status(404).json({ message, ...data });
  }
}

export class ResourceNotFoundError extends NotFoundError {
  constructor(res: NextApiResponse, message: string, data?: {}) {
    super(res, message, data);
    this.name = "Resource Not Found Error";
  }
}

export class UnprocessablePayloadError extends Error {
  constructor(name: string) {
    super("Unprocessable Payload");
    this.name = name;
  }
}

export class ValidationError extends Error {
  constructor(res: NextApiResponse, response: any) {
    super("Bad Request");
    this.name = "ValidationError";
    res.status(400).json(response);
  }
}

export class UnauthorizedError extends Error {
  constructor(name: string) {
    super("Unauthorized Error");
    this.name = name;
  }
}

export class NotLoggedInError extends UnauthorizedError {
  constructor(res: NextApiResponse, response: any) {
    super("NotLoggedInError");
    destroyCookie({ res }, "Client", {
      httpOnly: false,
      maxAge: 3600,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
    res.status(401).json({ code: 401, message: "Unauthorized Access" });
  }
}

export class RegistrationError extends UnprocessablePayloadError {
  constructor(res: NextApiResponse, response: any) {
    super("RegistrationError");
    res.status(422).json({ message: "Registratie niet verwerkt", ...response });
  }
}

export class EmailOccupiedError extends UnprocessablePayloadError {
  constructor(res: NextApiResponse) {
    super("EmailOccupiedError");
    res.status(422).json({
      message: "Registratie niet verwerkt",
      email: "Email reeds in gebruik",
    });
  }
}

export class InvalidEmailError extends UnprocessablePayloadError {
  constructor(res: NextApiResponse) {
    super("UnrecognizedEmailError");
    res.status(422).json({ email: "Foutieve email" });
  }
}

export class InvalidPasswordError extends UnprocessablePayloadError {
  constructor(res: NextApiResponse) {
    super("InvalidPasswordError");
    res.status(422).json({ password: "Invalid password" });
  }
}

export class ReedsIngeschrevenError extends UnprocessablePayloadError {
  constructor(res: NextApiResponse) {
    super("ReedsIngeschrevenError");
    res
      .status(422)
      .json({ message: "U bent reeds ingeschreven voor deze training" });
  }
}

export class TrainingVolzetError extends UnprocessablePayloadError {
  constructor(res: NextApiResponse, message: string) {
    super("TrainingVolzetError");
    res.status(422).json({ message });
  }
}
