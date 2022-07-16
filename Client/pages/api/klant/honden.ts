import { NextApiRequest, NextApiResponse } from "next";
import { validator } from "../../../middleware/Validator";
import baseResponse from "../../../types/responseType";

interface Response extends baseResponse {};

const handler = (req: NextApiRequest, res: NextApiResponse<Response>) => {
    const payload = validator.secureApi(req, res);
    if (!payload) return;
    return req.method === "GET"
        ? getKlantHonden(req, res, payload)
        : res.status(405).json({code: 405, message: "Not Allowed"});
}

const getKlantHonden = ( req: NextApiRequest, res: NextApiResponse, payload: {}) => {
    console.log(payload);
    res.status(200).json("")
};

export default handler;