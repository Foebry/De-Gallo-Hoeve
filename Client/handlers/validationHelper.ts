import { NextApiRequest, NextApiResponse } from "next";
import { AnySchema } from "yup";
import { nanoid } from "nanoid";
import { compare, hash } from "./authenticationHandler";
import { ValidationError } from "../middleware/RequestError";

interface OptionsInterface {
  schema: AnySchema;
  message?: string;
}

interface ValidationHelperInterface {
  redirect?: string;
  csrf?: string;
  salt?: string;
  validate: (
    obj: { req: NextApiRequest; res: NextApiResponse },
    options: OptionsInterface
  ) => Promise<void>;
  validateCsrfToken: (obj: {
    req: NextApiRequest;
    res: NextApiResponse;
  }) => Promise<void>;
  generateCsrf: () => string;
}

const validationHelper: ValidationHelperInterface = {
  validate: async ({ req, res }, options) => {
    const { message, schema } = options;
    const payload = req.body;
    const validationOptions = { abortEarly: false, stripUnknown: true };
    try {
      req.body = await schema.validate(payload, validationOptions);
    } catch (error: any) {
      const response = error.errors.reduce((prev: any, el: any) => {
        const [key, value] = Object.entries(el)[0];
        return { ...prev, [key]: value };
      });
      throw new ValidationError(res, { ...response, message });
    }
  },

  redirect: undefined,
  csrf: undefined,
  salt: undefined,

  validateCsrfToken: async ({ req, res }) => {
    const secret = `${process.env.CSRF_SECRET}`;
    if (!req.body.csrf || !compare(req.body.csrf, secret)) {
      throw new ValidationError(res, { message: "Ongeldig formulier" });
    }
  },

  generateCsrf: () => {
    const secret = `${process.env.CSRF_SECRET}`;
    return hash(nanoid(20), secret);
  },
};

export const { validate, validateCsrfToken, generateCsrf, redirect, csrf } =
  validationHelper;

export default validationHelper;
