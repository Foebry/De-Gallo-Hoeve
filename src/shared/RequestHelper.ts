import { getData } from 'src/utils/MongoDb';
import { HondCollection } from '../types/EntityTpes/HondTypes';
import { InschrijvingCollection } from '../types/EntityTpes/InschrijvingTypes';
import { IsKlantCollection } from '../types/EntityTpes/KlantTypes';
import { RasCollection } from '../types/EntityTpes/RasTypes';

export type PaginatedRequestQuery = Partial<{
  search: string;
  page: string;
  amount: string;
  id: string;
}>;

export type PaginatedResponse<Type> = {
  data: Type[];
  pagination: Pagination;
};

type Pagination = {
  currentPage: number;
  first: number;
  last: number;
  next?: string;
  previous?: string;
  total: number;
};

export type PaginatedData<T> = {
  data: T[];
  pagination: Pagination;
};

export async function getPaginatedData<T>(
  query: PaginatedRequestQuery,
  url: string,
  controller: 'KlantController'
): Promise<PaginatedData<T>>;
export async function getPaginatedData<T>(
  query: PaginatedRequestQuery,
  url: string,
  controller: 'InschrijvingController'
): Promise<PaginatedData<T>>;
export async function getPaginatedData<T>(
  query: PaginatedRequestQuery,
  url: string,
  controller: 'HondController'
): Promise<PaginatedData<T>>;
export async function getPaginatedData<T>(
  query: PaginatedRequestQuery,
  url: string,
  controller: 'RasController'
): Promise<PaginatedData<T>>;

export async function getPaginatedData<T>(
  query: PaginatedRequestQuery,
  url: string,
  controller: string
) {
  // await client.connect();
  console.log({ queryKlanten: query, url });

  const data = await getData(controller);

  const filteredData = filterData<T>(data, query);

  const pagination = getPagination<T>(query, url, filteredData);
  const { first, last } = pagination;

  return { data: filteredData.slice(first, last), pagination };
}

export const getPagination = <T>(
  query: PaginatedRequestQuery,
  url: string,
  data: T[]
): Pagination => {
  const { page, amount, search } = query;
  console.log({ query });

  const pageSize = parseInt(amount ?? '10');
  console.log({ page });
  const cPage = parseInt(page ?? '1');
  const currentPage = Math.min(Math.max(cPage, 1), Math.ceil(data.length / pageSize));
  console.log({ currentPage, length: data.length });
  const first = data.length === 0 ? 0 : Math.max((currentPage - 1) * pageSize, -1);
  console.log({ dataLength: data.length, first });
  // const first = Math.max(currentPage * pageSize, -1);
  const last = Math.min(first + pageSize, data.length);

  const searchValue = search ? `search=${search}` : undefined;
  const nextPage = data.length > last ? `page=${currentPage + 1}` : undefined;
  const prevPage = currentPage > 1 ? `page=${currentPage - 1}` : undefined;
  const sizeValue = `amount=${pageSize}`;
  const baseUrl = url.split('?')[0];

  return {
    currentPage,
    first,
    last,
    next: nextPage
      ? `${baseUrl}?${[searchValue, nextPage, sizeValue].filter(notEmpty).join('&')}`
      : undefined,
    previous: prevPage
      ? `${baseUrl}?${[searchValue, prevPage, sizeValue].filter(notEmpty).join('&')}`
      : undefined,
    total: data.length,
  };
};

function filterData<T>(data: IsKlantCollection[], query: PaginatedRequestQuery): T[];
function filterData<T>(data: InschrijvingCollection[], query: PaginatedRequestQuery): T[];
function filterData<T>(data: HondCollection[], query: PaginatedRequestQuery): T[];
function filterData<T>(data: RasCollection[], query: PaginatedRequestQuery): T[];
function filterData<T>(
  data:
    | IsKlantCollection[]
    | InschrijvingCollection[]
    | HondCollection[]
    | RasCollection[],
  query: PaginatedRequestQuery
) {
  const { search, id } = query;
  if (instanceOfKlantCollectionArray(data)) {
    return search
      ? data.filter(
          (klant) =>
            klant.email.toLowerCase().includes(search.toLowerCase()) ||
            klant.gemeente.toLowerCase().includes(search.toLowerCase()) ||
            klant.lnaam.toLowerCase().includes(search.toLowerCase()) ||
            klant.vnaam.toLowerCase().includes(search.toLowerCase())
        )
      : data;
  } else if (instanceOfInschrijvingCollectionArray(data)) {
    if (id) {
      const ids = id.split(',');
      return data.filter((inschrijving) => ids.includes(inschrijving._id.toString()));
    }
    return data;
  } else if (instanceOfRasCollectionArray(data)) {
    return search
      ? data.filter((ras) => ras.naam.toLowerCase().includes(search.toLowerCase()))
      : data;
  }
  return data;
}

function instanceOfKlantCollectionArray(array: any[]): array is IsKlantCollection[] {
  return (
    !array.length ||
    ('_id' in array[0] &&
      'roles' in array[0] &&
      'verified' in array[0] &&
      'inschrijvingen' in array[0] &&
      'reservaties' in array[0] &&
      'created_at' in array[0] &&
      'updated_at' in array[0] &&
      'email' in array[0] &&
      'password' in array[0] &&
      'vnaam' in array[0] &&
      'lnaam' in array[0] &&
      'gsm' in array[0] &&
      'straat' in array[0] &&
      'nr' in array[0] &&
      'gemeente' in array[0] &&
      'postcode' in array[0] &&
      'honden' in array[0])
  );
}

function instanceOfInschrijvingCollectionArray(
  array: any[]
): array is InschrijvingCollection[] {
  return (
    '_id' in array[0] &&
    'created_at' in array[0] &&
    'updated_at' in array[0] &&
    'datum' in array[0] &&
    'training' in array[0] &&
    'klant' in array[0] &&
    'id' in array[0].klant &&
    'vnaam' in array[0].klant &&
    'hond' in array[0] &&
    'id' in array[0].hond &&
    'naam' in array[0].hond
  );
}
function instanceOfRasCollectionArray(array: any[]): array is RasCollection[] {
  return (
    '_id' in array[0] && 'naam' in array[0] && 'soort' in array[0] && 'avatar' in array[0]
  );
}

export const notEmpty = <T>(obj: T | null | undefined): obj is T => {
  return obj !== null && obj !== undefined;
};

export const calculateDbSkip = (page: string, amount: string): number => {
  return (parseInt(page) - 1) * parseInt(amount);
};
