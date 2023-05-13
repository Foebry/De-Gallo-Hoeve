import { createContext, useContext, useState } from 'react';
// import { toast } from 'react-toastify';
// import { IsKlantCollection } from 'src/common/domain/klant';
// import getData from 'src/hooks/useApi';
// import useMutation from 'src/hooks/useMutation';
// import { PaginatedData, PaginatedResponse } from 'src/shared/RequestHelper';
// import { REQUEST_METHOD } from 'src/utils/axios';
// import { emptyPaginatedResponse } from './AdminContext';

// type Context = {
//   getKlanten: () => Promise<PaginatedData<IsKlantCollection>>;
//   getKlant: (id: string) => Promise<ApiResponse<KlantDto> | undefined>;
//   updateKlant: (
//     id: string,
//     updateData: KlantDto
//   ) => Promise<ApiResponse<KlantDto> | void>;
//   deleteKlant: (id: string) => Promise<ApiResponse<{}> | void>;
//   useGetKlant: (id: string) => Promise<KlantDto | void>;
// };

// type KlantDto = { id: string };
// type ApiError<T> = Partial<T> & { message: string; code: number };
// type ApiResponse<T> = { data: T | undefined; error: ApiError<T> | undefined };
export type RevalidateOptions = Partial<{
  maxRetries: number;
  revalidate: number;
}>;

// const defaultValues: Context = {
//   getKlanten: async () => emptyPaginatedResponse,
//   getKlant: async () => undefined,
//   updateKlant: async () => {},
//   deleteKlant: async () => {},
//   useGetKlant: async () => {},
// };

// const Context = createContext<Context>(defaultValues);

// const AdminProvider: React.FC<{ children: any }> = ({ children }) => {
//   const [revalidateKlanten, setRevalidateKlanten] = useState<boolean>(false);
//   const [revalidateKlant, setRevalidateKlant] = useState<boolean>(false);
//   const [klanten, setKlanten] = useState<PaginatedResponse<IsKlantCollection>>();
//   const [klantDetail, setKlantDetail] = useState<KlantDto>();

//   const update = useMutation<KlantDto, KlantDto>('/api/admin/klanten');
//   const remove = useMutation<{}, {}>('/api/admin/klanten');

//   const getKlanten = async () => {
//     if (!revalidateKlanten && klanten) return klanten;
//     const { data, error } = await getData<PaginatedResponse<IsKlantCollection>>('/');
//     if (data) setKlanten(data);
//     else if (error) toast.error('Fout bij laden van klanten');
//     return data;
//   };

//   const getKlant = async (id: string) => {
//     // if (!revalidateKlant && klantDetail && klantDetail.id === id) return klantDetail;
//     const { data, error } = await getData<KlantDto>(`/${id}`);
//     if (data) setKlantDetail(data);
//     else if (error) toast.error('Fout bij laden van klant detail');
//     return { data, error };
//   };

//   const updateKlant = async (id: string, updateData: KlantDto) => {
//     const { data, error } = await update(updateData, {
//       method: REQUEST_METHOD.PUT,
//       params: { id },
//     });
//     if (data) {
//       toast.success('klant succesvol gewijzigd!');
//       setRevalidateKlant(true);
//       setRevalidateKlanten(true);
//     } else if (error) toast.error('Fout bij wijzigen klant');
//     return { data, error };
//   };

//   const deleteKlant = async (id: string) => {
//     const { data, error } = await remove(null, {
//       method: REQUEST_METHOD.DELETE,
//       params: { id },
//     });
//     if (data) {
//       toast.success('Klant succesvol verwijderd!');
//       setRevalidateKlant(true);
//       setRevalidateKlanten(true);
//     } else if (error) toast.error('Fout bij verwijderen van klant');
//     return { data, error };
//   };

//   const useGetKlant = async (id: string, options?: RevalidateOptions) => {
//     const [tries, setTries] = useState<number>(0);
//     return;
//   };

//   return (
//     <Context.Provider
//       value={{
//         getKlant,
//         getKlanten,
//         updateKlant,
//         deleteKlant,
//         useGetKlant,
//       }}
//     >
//       {children}
//     </Context.Provider>
//   );
// };

// export default AdminProvider;

// export const useAdminContext = () => useContext(Context);
