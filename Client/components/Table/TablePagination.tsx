import React from "react";
import { PaginationInterface } from "./Table";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

interface Props {
  pagination: PaginationInterface;
  onClick: (api?: string) => Promise<void>;
}

const TablePagination: React.FC<Props> = ({ pagination, onClick }) => {
  return (
    <div className="text-gray-100 bg-green-200 flex justify-between font-bold capitalize rounded-b-xl items-center">
      <div
        onClick={() => onClick(pagination.previous)}
        className={
          pagination.previous
            ? `border-r border-gray-200 p-5 rounded-bl-xl text-2xl cursor-pointer`
            : undefined
        }
      >
        {pagination.previous && <MdNavigateBefore />}
      </div>
      <div className="py-5">
        {pagination.first} tot {pagination.last} van totaal {pagination.total} -
        pagina {pagination.page}
      </div>
      <div
        onClick={() => onClick(pagination.next)}
        className={
          pagination.next
            ? `border-l border-gray-200 p-5 rounded-br-xl text-2xl cursor-pointer`
            : undefined
        }
      >
        {pagination.next && <MdNavigateNext />}
      </div>
    </div>
  );
};

export default TablePagination;
