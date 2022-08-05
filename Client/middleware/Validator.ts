import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { AnySchema } from "yup";
import nookies, { parseCookies } from "nookies";
import jwt, { JwtPayload } from "jsonwebtoken";

interface OptionsInterface {
  schema: AnySchema;
  next?: () => void;
}

interface Validator {
  validate: (
    req: NextApiRequest,
    res: NextApiResponse,
    options: OptionsInterface
  ) => Promise<{ success: boolean; response?: {} }>;
  securePage: (ctx: GetServerSidePropsContext) => JwtPayload;
  secureApi: (req: NextApiRequest, res: NextApiResponse) => {} | void;
  redirectToLogin: (ctx: GetServerSidePropsContext, redirect?: string) => void;
	redirect?: string;
}

export const validator: Validator = {
  validate: async (req, res, options) => {
    try {
      await options.schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        response: error.errors.reduce((prev: any, el: any) => {
          const [key, value] = Object.entries(el)[0];
          return { ...prev, [key]: value };
        }),
      };
    }
  },

  securePage: (ctx) => {
    try {
    	validator.redirect = ctx.req.url;
      const cookies = nookies.get(ctx);
      const token = cookies.jwt;
      const secret = process.env.JWT_SECRET;
      return jwt.verify(token, `${secret}`, { algorithms: ["RS256", "HS256"] }) as JwtPayload;
    } catch (error: any) {
      validator.redirectToLogin(ctx, ctx.req.url);
      return {} as JwtPayload
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

	redirect: undefined
};

export default validator.validate;
