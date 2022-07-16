import { NextApiRequest, NextApiResponse } from "next";
import baseResponse from "../../../types/responseType";

interface Response extends baseResponse {};

const handler = (req: NextApiRequest, res: NextApiResponse<Response>) => {
    req.method === "DELETE"
        ? confirm(req, res)
        : req.method === "PATCH"
        ? reset(req, res)
        : res.status(405).json({code: 405, message: "Not Allowed"});
}

const confirm = (req: NextApiRequest, res: NextApiResponse) => {};

const reset = (req: NextApiRequest, res:NextApiResponse) => {};

export default handler;