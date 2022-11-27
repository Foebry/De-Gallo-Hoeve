import { nanoid } from "nanoid";
import React, { ReactNode } from "react";
import TableBody from "./TableBody";
import TableHead from "./TableHead";
import TablePagination from "./TablePagination";

type TableData = string | ReactNode;
export type TableRow = TableData[];

export interface PaginationInterface {
  first: number;
  last: number;
  total: number;
  currentPage: number;
  next?: string;
  previous?: string;
}

interface Props {
  rows: TableRow[];
  columns: string[];
  colWidths: string[];
  pagination?: PaginationInterface;
  onPaginationClick: (api?: string) => Promise<void>;
}

const Table: React.FC<Props> = ({
  rows,
  columns,
  colWidths,
  pagination,
  onPaginationClick,
}) => {
  return (
    <>
      <TableHead cols={columns} colWidths={colWidths} />
      <TableBody rows={rows} colWidths={colWidths} />
      {pagination && (
        <TablePagination pagination={pagination} onClick={onPaginationClick} />
      )}
    </>
    // <div className="table w-10/12 mx-auto border rounded-t-2xl flex flex-col gap-2">
    //   <div className="table-header-group bg-gray-900">
    //     <div className="table-row flex text-gray-200">
    //       {columns.map((col) => (
    //         <div
    //           key={nanoid(10)}
    //           className="table-cell capitalize py-3 font-bold px-2"
    //         >
    //           {col}
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    //   <div className="table-row-group mt-5">
    //     {rows.map((row: TableRow) => (
    //       <div key={nanoid(10)} className="table-row">
    //         {row.map((item, index) => (
    //           <div
    //             key={nanoid(10)}
    //             className={`${index === 0 && "cursor-pointer"} table-cell px-2`}
    //           >
    //             {item}
    //           </div>
    //         ))}
    //       </div>
    //     ))}
    //   </div>
    // </div>
    // <table className="table-auto mx-auto w-10/12">
    //   <thead>
    //     <tr className="text-left capitalize">
    //       {columns.map((col) => (
    //         <th>{col}</th>
    //       ))}
    //     </tr>
    //   </thead>
    //   <tbody>
    //     {rows.map((row: TableRow) => (
    //       <tr className="h-14">
    //         {row.map((item, index) => (
    //           <td
    //             key={nanoid(5)}
    //             className={`${index === 0 && "cursor-pointer"}`}
    //           >
    //             {item}
    //           </td>
    //         ))}
    //       </tr>
    //     ))}
    //   </tbody>
    // </table>
  );
};

export default Table;
