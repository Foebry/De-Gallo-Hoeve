import { getAllKlanten } from "../../controllers/KlantController";
import client from "../MongoDb";

interface PaginatedRequestQuery {
  search?: string;
  page?: string;
  amount?: string;
}

export const getPaginatedKlanten = async (query: PaginatedRequestQuery) => {
  const { search, page, amount } = query;
  await client.connect();
  const klanten = await getAllKlanten();

  const searchValue =
    search && search !== "undefined" ? search.toLowerCase() : undefined;
  const pageSize = parseInt(amount ?? "10");
  const first = (parseInt(page ?? "1") - 1) * pageSize;
  const currentPage = parseInt(page ?? "1");

  const filteredKlanten = searchValue
    ? klanten.filter(
        (klant) =>
          klant.email.toLowerCase().includes(searchValue) ||
          klant.gemeente.toLowerCase().includes(searchValue) ||
          klant.lnaam.toLowerCase().includes(searchValue) ||
          klant.straat.toLowerCase().includes(searchValue) ||
          klant.vnaam.toLowerCase().includes(searchValue)
      )
    : klanten;

  const last = Math.min(first + pageSize, filteredKlanten.length);
  const next =
    filteredKlanten.length > last
      ? `/api/admin/klanten?search=${search}&page=${
          currentPage + 1
        }&amount=${pageSize}`
      : undefined;
  const previous =
    last - pageSize > 0
      ? `/api/admin/klanten?search=${search}&page=${
          currentPage - 1
        }&amount=${pageSize}`
      : undefined;
  const total = filteredKlanten.length;

  return {
    data: filteredKlanten.slice(first, last),
    pagination: { currentPage, first, last, next, previous, total },
  };
};
