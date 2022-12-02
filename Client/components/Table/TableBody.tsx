import { nanoid } from "nanoid";
import React, { ReactNode } from "react";
import TableRow from "./TableRow";

type TableData = string | ReactNode;
export type TableRow = TableData[];

interface Props {
  rows: TableRow[];
  colWidths: string[];
}

const TableBody: React.FC<Props> = ({ rows, colWidths }) => {
  return (
    <div>
      {rows.map((row) => (
        <TableRow cells={row} colWidths={colWidths} key={nanoid(5)} />
      ))}
    </div>
  );
};

export default TableBody;
