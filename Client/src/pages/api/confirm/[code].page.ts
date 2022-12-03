import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import {
  getConfirmByCode,
  getConfirmCollection,
} from "src/controllers/ConfirmController";
import { getKlantById, KLANT } from "src/controllers/KlantController";
import Factory from "src/services/Factory";
import { closeConnection, getConnection } from "src/utils/MongoDb";
import {
  ExpiredConfirmCodeError,
  InvalidConfirmCodeError,
  KlantNotFoundError,
} from "src/middlewares/RequestError";
import { CONFIRM } from "src/types/EntityTpes/ConfirmTypes";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") return confirm(req, res);
  else if (req.method === "PUT") return reset(req, res);
  else return res.status(405).json({ code: 405, message: "Not Allowed" });
};

const confirm = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const confirmCollection = await getConfirmCollection();

    const { code } = req.query;

    const confirm = await getConfirmByCode(code as string);
    if (!confirm) throw new InvalidConfirmCodeError();

    if (moment(confirm.valid_to) < moment())
      throw new ExpiredConfirmCodeError();

    const klant = await getKlantById(confirm.klant_id);
    if (!klant) throw new KlantNotFoundError();

    await Factory.getController(KLANT).setVerified(klant);
    await confirmCollection.deleteOne({ code });
    await closeConnection();
    return res.redirect("/login");
  } catch (e: any) {
    return res.status(e.code).send(e.response);
  }
};

const reset = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { code } = req.query;

    const confirm = await getConfirmByCode(code as string);
    if (!confirm) throw new InvalidConfirmCodeError();

    const klant = await getKlantById(confirm.klant_id);
    if (!klant) throw new KlantNotFoundError();

    const newConfirm = await Factory.getController(CONFIRM).reset(confirm);
    return res.status(200).json(newConfirm);
  } catch (e: any) {
    return res.status(e.code).send(e.response);
  }
};

export default handler;
