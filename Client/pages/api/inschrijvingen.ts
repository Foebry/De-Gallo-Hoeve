import { NextApiRequest, NextApiResponse } from "next";
import mailer from "../../middleware/Mailer";
import validate from "../../middleware/Validator";
import baseResponse from "../../types/responseType";
import { inschrijvingSchema } from "../../types/schemas";

interface Response extends baseResponse{
}



const handler = (req: NextApiRequest, res:NextApiResponse<Response>) => {

    if (req.method === "POST") return postInschrijving(req, res);
    
    res.status(405).json({ code: 405, message: "Not Allowed" });
}

const postInschrijving = (req: NextApiRequest, res: NextApiResponse) => {

    validate(req.body, res, {schema: inschrijvingSchema});

    mailer.sendMail("inschrijving");

    res.status(201).json({ success: "Uw boeking is goed ontvangen!" });

}

export default handler;