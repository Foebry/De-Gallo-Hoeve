import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { AnySchema } from "yup";
import nookies, { parseCookies } from "nookies";
import jwt, { JwtPayload } from "jsonwebtoken";
import { nanoid } from "nanoid";
import { compare, hash } from "./Hashing";
import db, { conn } from "./db";

interface OptionsInterface {
  schema: AnySchema;
  next?: () => void;
}

interface Validator {
  redirect?: string;
  csrf?: string;
  salt?: string;
  validate: (
    req: NextApiRequest,
    res: NextApiResponse,
    options: OptionsInterface,
    callback: (obj: any) => void
  ) => Promise<void>;
  securePage: (ctx: GetServerSidePropsContext) => JwtPayload;
  secureApi: (req: NextApiRequest, res: NextApiResponse) => {} | void;
  redirectToLogin: (ctx: GetServerSidePropsContext, redirect?: string) => void;
  validateCsrfToken: (
    obj: { req: NextApiRequest; res: NextApiResponse },
    callback: any
  ) => void;
  refreshCsrf: () => string;
  confirmRegister: (
    req: NextApiRequest,
    res: NextApiResponse,
    callback: () => void
  ) => Promise<void>;
  confirmInschrijving: (obj: {
    req: NextApiRequest;
    res: NextApiResponse;
  }) => Promise<void>;
  inschrijvingNotLoggedIn: (obj: {
    req: NextApiRequest;
    res: NextApiResponse;
  }) => Promise<void>;
  inschrijvingLoggedIn: (obj: {
    req: NextApiRequest;
    res: NextApiResponse;
  }) => Promise<void>;
}

export const validator: Validator = {
  validate: async (req, res, options, callback) => {
    try {
      await options.schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      return callback({ req, res });
    } catch (error: any) {
      const response = error.errors.reduce((prev: any, el: any) => {
        const [key, value] = Object.entries(el)[0];
        return { ...prev, [key]: value };
      });
      return res.status(400).json(response);
    }
  },

  securePage: (ctx) => {
    try {
      validator.redirect = ctx.req.url;
      const cookies = nookies.get(ctx);
      const token = cookies.JWT;
      const secret = process.env.JWT_SECRET;
      return jwt.verify(token, `${secret}`, {
        algorithms: ["RS256", "HS256"],
      }) as JwtPayload;
    } catch (error: any) {
      validator.redirectToLogin(ctx, ctx.req.url);
      return {} as JwtPayload;
    }
  },

  secureApi: (req, res) => {
    const cookies = parseCookies({ req });
    const token = cookies.jwt || req.headers.authorization?.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .json({ code: 401, message: "Unauthorized Access" });

    try {
      const verifiedToken = jwt.verify(token, `${process.env.JWT_SECRET}`, {
        algorithms: ["RS256", "HS256"],
      });
      return verifiedToken;
    } catch (error: any) {
      return res
        .status(401)
        .json({ code: 401, message: "Unauthorized Access" });
    }
  },

  redirectToLogin: (ctx) => {
    ctx.res.setHeader("location", "/login");
    ctx.res.statusCode = 302;
  },

  refreshCsrf: () => {
    const secret = `${process.env.CSRF_SECRET}`;
    return hash(nanoid(20), secret);
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

  confirmRegister: async (req, res, callback) => {
    const email = req.body.email;
    const data = await db.query({
      builder: conn.select("email").from("klant").where(email).first(),
    });
    if (data)
      return res.status(400).json({
        email: "Email adres in gebruik",
        message: "Registratie kon niet verwerkt worden.",
      });
    return res.status(201).json({});
  },

  confirmInschrijving: async ({ req, res }) => {
    const { klant_id } = req.body;
    return klant_id === 0
      ? validator.inschrijvingNotLoggedIn({ req, res })
      : validator.inschrijvingLoggedIn({ req, res });
  },

  inschrijvingNotLoggedIn: async ({ req, res }) => {
    return res
      .status(200)
      .json({ message: "Inschrijving(en) goed ontvangen!" });
  },

  inschrijvingLoggedIn: async ({ req, res }) => {
    return res.status(400).json({ message: "logged in" });
  },
};

export const {
  validate,
  secureApi,
  securePage,
  redirectToLogin,
  validateCsrfToken,
  refreshCsrf,
  redirect,
  csrf,
  confirmRegister,
  confirmInschrijving,
} = validator;
