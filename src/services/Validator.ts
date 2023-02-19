import { NextApiRequest, NextApiResponse } from 'next';
import { AnySchema } from 'yup';
import { compare, hash } from './Authenticator';
import { InvalidCsrfError, ValidationError } from '../shared/RequestError';

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
    const validationOptions = { abortEarly: false, stripUnknown: false };
    try {
      req.body = await schema.validate(payload, validationOptions);
    } catch (error: any) {
      let response = {};
      if (error.errors.length > 1) {
        response = error.errors.reduce((prev: any, curr: any) => {
          const [key, value] = Object.entries(curr)[0];
          return { ...prev, [key]: value };
        }, {});
      } else {
        console.log('inside els clause');
        response = error.errors.reduce((prev: any, curr: any) => {
          const [key, value] = Object.entries(curr)[0];
          return { ...prev, [key]: value };
        }, {});
        // response = { ...error.errors, message };
      }
      throw new ValidationError(message, response);
    }
  },

  redirect: undefined,
  csrf: undefined,
  salt: undefined,

  validateCsrfToken: async ({ req }) => {
    const secret = 'DEF';
    if (!req.body.csrf || !compare(req.body.csrf, secret)) {
      throw new InvalidCsrfError();
    }
  },

  generateCsrf: () => {
    // const secret = `${process.env.CSRF_SECRET}`;
    const secret = 'DEF';
    return hash(Math.random().toString(32).substring(2), secret);
  },
};

export const { validate, validateCsrfToken, generateCsrf, redirect, csrf } =
  validationHelper;

export default validationHelper;
