import { NextApiRequest, NextApiResponse } from "next";
import {
  getAllKlanten,
  getKlantCollection,
} from "../../../../controllers/KlantController";
import client from "../../../../middleware/MongoDb";
import { IsKlantCollection } from "../../../../types/EntityTpes/KlantTypes";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") return getKlantenOverview(req, res);
};

const getKlantenOverview = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await client.connect();
  const { search, page, amount } = req.query;
  const klanten = await getAllKlanten();
  const searchValue =
    search && search !== "undefined" ? (search as string) : undefined;

  const pageSize = parseInt((amount as string) ?? 10);
  const first = (parseInt((page as string) ?? 1) - 1) * pageSize;
  const currentPage = page ? parseInt(page as string) : 1;

  const filteredKlanten = searchValue
    ? klanten.filter(
        (klant) =>
          klant.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          klant.gemeente.toLowerCase().includes(searchValue.toLowerCase()) ||
          klant.lnaam.toLowerCase().includes(searchValue.toLowerCase()) ||
          klant.straat.toLowerCase().includes(searchValue.toLowerCase()) ||
          klant.vnaam.toLowerCase().includes(searchValue.toLowerCase())
      )
    : klanten;

  const last = Math.min(first + pageSize, filteredKlanten.length);
  const next =
    filteredKlanten.length > last &&
    `/api/admin/klanten?search=${search}&page=${
      currentPage + 1
    }&amount=${pageSize}`;
  const previous =
    last - pageSize > 0 &&
    `/api/admin/klanten?search=${search}&page=${
      currentPage - 1
    }&amount=${pageSize}`;
  const result = mapToResult(filteredKlanten, {
    currentPage,
    first,
    last,
    next,
    previous,
  });

  return res.status(200).send(result);
};

export default handler;

const mapToResult = (
  filteredKlanten: IsKlantCollection[],
  {
    currentPage,
    first,
    last,
    next,
    previous,
  }: {
    currentPage: number;
    first: number;
    last: number;
    next: string | boolean;
    previous: string | boolean;
  }
) => {
  const klanten = filteredKlanten.map(
    ({
      password,
      honden,
      inschrijvingen,
      reservaties,
      gsm,
      roles,
      created_at,
      updated_at,
      ...data
    }) => data
  );
  const pagination = {
    page: currentPage,
    first: first + 1,
    last,
    total: filteredKlanten.length,
    next: next ?? undefined,
    previous: previous ? previous : undefined,
  };
  return { klanten, pagination };
};
