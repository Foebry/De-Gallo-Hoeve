import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { conn } from "./db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nookies, { parseCookies, setCookie } from "nookies";

const secret = process.env.JWT_SECRET;
const cookieSecret = process.env.NEXT_PUBLIC_COOKIE_SECRET;

interface Controller {
  setCookies: (obj: { req: NextApiRequest; res: NextApiResponse }) => void;
  createJWT: (res: NextApiResponse, data: any) => void;
  setClientCookie: (res: NextApiResponse, data: any) => void;
  secureApi: (req: NextApiRequest, res: NextApiResponse) => void;
  authenticatedUser: (
    ctx: GetServerSidePropsContext,
    callback: (userId?: number) => any
  ) => void;
  getDataFromCookie: (cookie: string, item: string | string[]) => any;
}

export const controller: Controller = {
  setCookies: async ({ req, res }) => {
    const { email, password } = req.body;
    const response = await conn
      .select("id", "email", "roles", "vnaam", "verified", "password")
      .from("klant")
      .where({ email })
      .first();
    if (!response) {
      return res.status(400).json({ code: 400, email: "Email not found" });
    }
    const data = JSON.parse(JSON.stringify(response));
    const match = await bcrypt.compare(password, data.password);
    if (match) {
      controller.createJWT(res, data);
      controller.setClientCookie(res, data);
      return res.status(200).json({});
    }
    return res.status(400).json({ code: 400, password: "Invalid password" });
  },

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

  secureApi: (req, res) => {
    const cookies = parseCookies({ req });
    const token = cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ code: 401, message: "Unauthorized Access" });
    }
    const verifiedToken = jwt.verify(token, `${secret}`, {
      algorithms: ["RS256", "HS256"],
    });
    if (!verifiedToken) {
      return res
        .status(401)
        .json({ code: 401, message: "Unauthorized Access" });
    }
    return verifiedToken;
  },

  authenticatedUser: async ({ req }, callback) => {
    const token = nookies.get({ req }).JWT;
    let klant_id = undefined;
    if (token) {
      const verifiedToken = jwt.verify(token, `${secret}`, {
        algorithms: ["RS256", "HS256"],
      });
      klant_id = JSON.parse(JSON.stringify(verifiedToken)).payload.id;
    }
    return await callback(klant_id);
  },

  getDataFromCookie: (cookie, item) => {
    console.log("trying to access cookies");
    // try{
    // const cookies = parseCookies();
    // console.log(cookies)
    // }
    // catch(error: any){
    //   console.log("something went wrong")
    // }
    return {};
  },
};

export default controller.setCookies;
export const {
  getDataFromCookie,
  createJWT,
  authenticatedUser,
  secureApi,
  setClientCookie,
} = controller;
