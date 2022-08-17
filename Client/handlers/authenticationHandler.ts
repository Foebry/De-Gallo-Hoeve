import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import nookies, { parseCookies, setCookie } from "nookies";
import { unauthorizedAccess } from "./ResponseHandler";
import { ObjectId } from "mongodb";
import { INSCHRIJVING, LOGIN } from "../types/linkTypes";
import validationHelper from "./validationHelper";
import base64 from "base-64";

interface AuthenticationHandlerInterface {
  createJWT: (res: NextApiResponse, klantData: any) => void;
  setClientCookie: (res: NextApiResponse, payload: any) => void;
  secureApi: (obj: {
    req: NextApiRequest;
    res: NextApiResponse;
  }) => void | string | JwtPayload;
  redirectToLogin: (ctx: GetServerSidePropsContext, redirect?: string) => void;
  securepage: (
    ctx: GetServerSidePropsContext,
    callback: (klant_id: ObjectId) => any
  ) => Promise<void>;
  hash: (value: string | object, secret: string) => string;
  compare: (value: string, secret: string) => boolean;
}

const secret = process.env.JWT_SECRET;
const cookieSecret = process.env.NEXT_PUBLIC_COOKIE_SECRET;

const authenticationHandler: AuthenticationHandlerInterface = {
  createJWT: (res, klantData) => {
    const payload = { ...klantData, password: undefined };
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
    const token = cookies.jwt;
    if (!token) return unauthorizedAccess(res);

    const verifiedToken = jwt.verify(token, `${secret}`, {
      algorithms: ["RS256", "HS256"],
    });

    return verifiedToken ?? unauthorizedAccess(res);
  },

  redirectToLogin: (ctx) => {
    ctx.res.setHeader("location", "/login");
    ctx.res.statusCode = 302;
  },

  securepage: async ({ req, res }, callback) => {
    const token = nookies.get({ req }).JWT;
    if (token) {
      const verifiedToken = jwt.verify(token, `${secret}`, {
        algorithms: ["RS256", "HS256"],
      });
      const klant_id = JSON.parse(JSON.stringify(verifiedToken)).payload._id;
      return await callback(new ObjectId(klant_id));
    }
    validationHelper.redirect = INSCHRIJVING;
    return {
      redirect: { permanent: false, destination: LOGIN },
    };
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
} = authenticationHandler;
