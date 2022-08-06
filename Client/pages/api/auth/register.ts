import { NextApiRequest, NextApiResponse } from "next";
import mailer from "../../../middleware/Mailer";
import validate from "../../../middleware/Validator";
import baseResponse from "../../../types/responseType";
import { registerSchema } from "../../../types/schemas";

interface Response extends baseResponse {};

const handler = (req: NextApiRequest, res: NextApiResponse<Response>) => {
    req.method === "POST"
        ? register( req, res )
        : res.status(405).json({code:405, message:"Not Allowed"});
}

const register = async (req: NextApiRequest, res: NextApiResponse) => {

    return await validate(req, res, {
        schema: registerSchema,
      }, () => {});
      
    //   if(!success) return res.status(400).send(response);

    // mailer.sendMail("register");

    // res.status(201).json({success: "Bedankt voor uw registratie!"});
}

export default handler;