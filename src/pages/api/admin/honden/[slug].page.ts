import { getHondById } from "src/controllers/HondController";
import { getEigenaarVanHond } from "src/controllers/KlantController";
import { getRasByName } from "src/controllers/rasController";
import { mapToHondDetailResponse } from "src/mappers/honden";
import client from "src/utils/MongoDb";
import {
  HondNotFoundError,
  KlantNotFoundError,
  RasNotFoundError,
} from "src/shared/RequestError";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { GenericRequest } from "src/pages/api/auth/login.page";

export interface HondDetailResponse {
  _id: string;
  naam: string;
  ras: {
    naam: string;
    _id: string;
  };
  geboortedatum: string;
  geslacht: string;
  eigenaar: {
    fullName: string;
    _id: string;
  };
}

interface HondDetailRequest {
  query: Partial<{ slug: string }>;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET")
    return getHondDetail(req as GenericRequest<HondDetailRequest>, res);
};

const getHondDetail = async (
  req: GenericRequest<HondDetailRequest>,
  res: NextApiResponse<HondDetailResponse>
) => {
  try {
    const { slug: _id } = req.query;

    await client.connect();

    const hond = await getHondById(new ObjectId(_id));
    if (!hond) throw new HondNotFoundError();

    const klant = await getEigenaarVanHond(hond);
    if (!klant) throw new KlantNotFoundError();

    const ras = await getRasByName(hond.ras);
    if (!ras) throw new RasNotFoundError();

    // await client.close();

    const result = mapToHondDetailResponse(hond, klant, ras);

    return res.status(200).send(result);
  } catch (e: any) {
    return res.status(e.code).send(e.message);
  }
};

export default handler;
