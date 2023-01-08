import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import {
  getConfirmByCode,
  getConfirmCollection,
} from "src/controllers/ConfirmController";
import { getKlantById, KLANT } from "src/controllers/KlantController";
import Factory from "src/services/Factory";
import client from "src/utils/MongoDb";
import {
  ExpiredConfirmCodeError,
  InvalidConfirmCodeError,
  KlantNotFoundError,
} from "src/shared/RequestError";
import { CONFIRM } from "src/types/EntityTpes/ConfirmTypes";
import { logError } from "src/controllers/ErrorLogController";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") return confirm(req, res);
  else if (req.method === "PUT") return reset(req, res);
  else return res.status(405).json({ code: 405, message: "Not Allowed" });
};

const confirm = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await client.connect();

    const { code } = req.query;

    const confirm = await getConfirmByCode(code as string);
    if (!confirm) throw new InvalidConfirmCodeError();

    if (moment(confirm.valid_to) < moment())
      throw new ExpiredConfirmCodeError();

    const klant = await getKlantById(confirm.klant_id);
    if (!klant) throw new KlantNotFoundError();

    await Factory.getController(KLANT).setVerified(klant);
    await getConfirmCollection().deleteOne({ code });
    await client.close();
    return res.redirect("/login");
  } catch (e: any) {
    logError("confirm", req, e);
    return res.status(e.code).send(e.response);
  }
};

const reset = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await client.connect();
    const { code } = req.query;

    const confirm = await getConfirmByCode(code as string);
    if (!confirm) throw new InvalidConfirmCodeError();

    const klant = await getKlantById(confirm.klant_id);
    if (!klant) throw new KlantNotFoundError();

    const newConfirm = await Factory.getController(CONFIRM).reset(confirm);
    await client.close();
    return res.status(200).json(newConfirm);
  } catch (e: any) {
    logError("reset", req, e);
    return res.status(e.code).send(e.response);
  }
};

export default handler;
