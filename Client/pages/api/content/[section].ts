import { NextApiResponse, NextApiRequest } from "next";
import db, { conn } from "../../../middleware/db";
import baseResponse from "../../../types/responseType";

interface Response extends baseResponse {}

const handler = (req: NextApiRequest, res: NextApiResponse<Response>) => {
  switch (req.method) {
    case "GET":
      if (req.query.section === "diensten") return getDiensten(res);
      else if (req.query.section === "hotel") return getHotel(res);
      else return res.status(404).json({ code: 404, message: "Not Found" });
    default:
      return res.status(405).json({ code: 405, message: "Not Allowed" });
  }
};

const getDiensten = async (res: NextApiResponse) => {
  return await db.query(
    {
      builder: conn
        .select("image", "summary", "caption", "link")
        .from("dienst"),
    },
    res
  );
};

const getHotel = async (res: NextApiResponse) => {
  return await db.query(
    {
      builder: conn
        .select("content")
        .from("content")
        .whereIn("id", ["2", "3", "4"]),
    },
    res
  );
};

export default handler;
