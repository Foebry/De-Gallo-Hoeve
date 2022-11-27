import { nanoid } from "nanoid";
import React from "react";
import TableCell from "./TableCell";

interface Props {
  cols: string[];
  colWidths: string[];
}

const TableHead: React.FC<Props> = ({ cols, colWidths }) => {
  return (
    <div className="text-gray-100 bg-green-200 flex justify-between px-2 font-bold capitalize py-5 rounded-t-xl">
      {cols.map((columnHead, index) => (
        <TableCell
          key={nanoid(10)}
          body={columnHead}
          width={colWidths[index] + "%"}
          spacing={index === cols.length - 1 ? "text-right" : "text-left"}
        />
      ))}
    </div>
  );
};

export default TableHead;
