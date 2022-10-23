export const a = 2;
// import client, { getData } from "../MongoDb";
// import { PaginatedData } from "../mappers/klanten";

// export const getPaginatedKlanten = async <T>(
//   query: PaginatedRequestQuery,
//   controller:
//     | "HondController"
//     | "InschrijvingController"
//     | "KlantController"
//     | "RasController"
//   // controller: PaginatedControllerType
// ): Promise<PaginatedData<T>> => {
//   const { search, page, amount } = query;
//   await client.connect();

//   const data = await getData(controller);
//   // const klanten = await getAllKlanten();

//   const searchValue =
//     search && search !== "undefined" ? search.toLowerCase() : undefined;
//   // const pageSize = parseInt(amount ?? "10");
//   // const first = (parseInt(page ?? "1") - 1) * pageSize;
//   // const currentPage = parseInt(page ?? "1");

//   const filteredData = searchValue ? filterData<T>(data, search) : data;
//   // const filteredKlanten = searchValue
//   //   ? klanten.filter(
//   //       (klant) =>
//   //         klant.email.toLowerCase().includes(searchValue) ||
//   //         klant.gemeente.toLowerCase().includes(searchValue) ||
//   //         klant.lnaam.toLowerCase().includes(searchValue) ||
//   //         klant.straat.toLowerCase().includes(searchValue) ||
//   //         klant.vnaam.toLowerCase().includes(searchValue)
//   //     )
//   //   : klanten;

//   const pagination = await getPagination(query, filteredData);
//   const { first, last } = pagination;

//   // const last = Math.min(first + pageSize, filteredKlanten.length);
//   // const next =
//   //   filteredKlanten.length > last
//   //     ? `/api/admin/klanten?search=${search}&page=${
//   //         currentPage + 1
//   //       }&amount=${pageSize}`
//   //     : undefined;
//   // const previous =
//   //   last - pageSize > 0
//   //     ? `/api/admin/klanten?search=${search}&page=${
//   //         currentPage - 1
//   //       }&amount=${pageSize}`
//   //     : undefined;
//   // const total = filteredKlanten.length;

//   return { data: filteredData.slice(first, last), pagination };
// };
