import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import jwt from "jsonwebtoken";
import nookies, { parseCookies, setCookie } from "nookies";
import { ObjectId } from "mongodb";
import { INSCHRIJVING } from "../types/linkTypes";
import validationHelper from "./Validator";
import base64 from "base-64";
import { EmailNotVerifiedError, UnauthorizedAccessError } from "./RequestError";

interface AuthenticationHandlerInterface {
  createJWT: (res: NextApiResponse, klantData: any) => void;
  setClientCookie: (res: NextApiResponse, payload: any) => void;
  secureApi: (obj: { req: NextApiRequest; res: NextApiResponse }) => void;
  redirectToLogin: (ctx: GetServerSidePropsContext, redirect?: string) => void;
  securepage: (ctx: GetServerSidePropsContext) => Promise<ObjectId | void>;
  hash: (value: string | object, secret: string) => string;
  compare: (value: string, secret: string) => boolean;
}

const secret = process.env.JWT_SECRET;
const cookieSecret = process.env.NEXT_PUBLIC_COOKIE_SECRET;

const authenticationHandler: AuthenticationHandlerInterface = {
  createJWT: (res, { verified, honden, roles, _id }) => {
    const payload = { verified, honden, roles, _id };
    const token = jwt.sign({ payload }, `${secret}`);
    setCookie({ res }, "JWT", token, {
      httpOnly: true,
      maxAge: 3600,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
  },

  setClientCookie: (res, klantData) => {
    const { vnaam: name } = klantData;
    const token = jwt.sign({ name }, `${cookieSecret}`);
    setCookie({ res }, "Client", token, {
      httpOnly: false,
      maxAge: 3600,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
  },

  secureApi: ({ req, res }) => {
    const cookies = parseCookies({ req });
    const token = cookies.JWT;
    if (!token) throw new UnauthorizedAccessError();

    const verifiedToken = jwt.verify(token, `${secret}`, {
      algorithms: ["RS256", "HS256"],
    });
    const {
      payload: { verified },
    } = JSON.parse(JSON.stringify(verifiedToken));
    if (!verifiedToken) throw new UnauthorizedAccessError();
    if (!verified) throw new EmailNotVerifiedError();
  },

  redirectToLogin: (ctx) => {
    ctx.res.setHeader("location", "/login");
    ctx.res.statusCode = 302;
  },

  securepage: async ({ req, res }) => {
    const token = nookies.get({ req }).JWT;
    if (token) {
      const verifiedToken = jwt.verify(token, `${secret}`, {
        algorithms: ["RS256", "HS256"],
      });
      const { _id: klant_id } = JSON.parse(
        JSON.stringify(verifiedToken)
      ).payload;
      return new ObjectId(klant_id);
    }
    validationHelper.redirect = INSCHRIJVING;

    // throw new NotLoggedInError(res, null);
    // return {
    //   redirect: { permanent: false, destination: LOGIN },
    // };
  },

  hash: (value, secret) => {
    const encValue = base64.encode(
      typeof value === "string" ? value : JSON.stringify(value)
    );
    const signature = jwt
      .sign(typeof value === "string" ? value : JSON.stringify(value), secret)
      .split(".")[2];
    return `${encValue}$${signature}`;
  },

  compare: (value, secret) => {
    const [encValue, signature] = value.split("$");
    try {
      const decValue = base64.decode(encValue);
      return signature === hash(decValue, secret).split("$")[1];
    } catch (error) {
      return false;
    }
  },
};

export const {
  createJWT,
  setClientCookie,
  secureApi,
  redirectToLogin,
  securepage,
  hash,
  compare,
} = authenticationHandler;
