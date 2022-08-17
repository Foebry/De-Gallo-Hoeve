import { NextApiRequest, NextApiResponse } from "next";
import { AnySchema } from "yup";
import { nanoid } from "nanoid";
import { compare, hash } from "./authenticationHandler";

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
    options: OptionsInterface,
    callback: (obj: any) => void
  ) => Promise<void>;
  validateCsrfToken: (
    obj: { req: NextApiRequest; res: NextApiResponse },
    callback: any
  ) => Promise<void>;
  generateCsrf: () => string;
}

const validationHelper: ValidationHelperInterface = {
  validate: async ({ req, res }, options, callback) => {
    const { message, schema } = options;
    const payload = req.body;
    const validationOptions = { abortEarly: false, stripUnknown: true };
    try {
      req.body = await schema.validate(payload, validationOptions);
      return callback({ req, res });
    } catch (error: any) {
      const response = error.errors.reduce((prev: any, el: any) => {
        const [key, value] = Object.entries(el)[0];
        return { ...prev, [key]: value };
      });
      return res.status(400).json({ ...response, message: message });
    }
  },

  redirect: undefined,
  csrf: undefined,
  salt: undefined,

  validateCsrfToken: async ({ req, res }, callback) => {
    const secret = `${process.env.CSRF_SECRET}`;
    if (!req.body.csrf || !compare(req.body.csrf, secret))
      return res.status(400).json({ message: "Ongeldig formulier" });

    return await callback();
  },

  generateCsrf: () => {
    const secret = `${process.env.CSRF_SECRET}`;
    return hash(nanoid(20), secret);
  },
};

export const { validate, validateCsrfToken, generateCsrf, redirect, csrf } =
  validationHelper;

export default validationHelper;
