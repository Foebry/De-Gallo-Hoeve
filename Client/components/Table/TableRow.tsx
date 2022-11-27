import { nanoid } from "nanoid";
import React from "react";
import { TableRow } from "./Table";
import TableCell from "./TableCell";

export type SpacingOption = "text-center" | "text-right" | "text-left";

interface Props {
  cells: TableRow;
  spacing?: SpacingOption;
  colWidths: string[];
}

const TableRow: React.FC<Props> = ({ cells, colWidths }) => {
  return (
    <div className="flex justify-between px-2 border-x border-b border-grey-100 border-solid">
      {cells.map((cell, index) => (
        <TableCell
          body={cell}
          key={nanoid(10)}
          width={colWidths[index] + "%"}
          spacing={index === cells.length - 1 ? "text-right" : "text-left"}
        />
      ))}
    </div>
  );
};

export default TableRow;
