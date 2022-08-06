import { NextApiRequest, NextApiResponse } from "next";
import { conn } from "./db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { setCookie } from "nookies";

const secret = process.env.JWT_SECRET;
const cookieSecret = process.env.NEXT_PUBLIC_COOKIE_SECRET;

interface Controller {
  setCookies: (obj: { req: NextApiRequest; res: NextApiResponse }) => void;
  createJWT: (res: NextApiResponse, data: any) => void;
  setClientCookie: (res: NextApiResponse, data: any) => void;
}

export const controller: Controller = {
  setCookies: async ({ req, res }) => {
    const { email, password } = req.body;
    const response = await conn
      .select("id", "email", "roles", "vnaam", "verified", "password")
      .from("klant")
      .where({ email })
			.first();
    if (!response){
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
		const token = jwt.sign({name}, `${cookieSecret}`)
    setCookie({ res }, "Client", token, {
      httpOnly: false,
      maxAge: 3600,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
  },
};

export default controller.setCookies;
