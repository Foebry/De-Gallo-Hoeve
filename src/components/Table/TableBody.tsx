import { nanoid } from 'nanoid';
import React, { ReactNode } from 'react';
import { TableRow as TableRowType } from './Table';
import TableRow from './TableRow';

// type TableData = string | ReactNode;
// export type TableRow = { rowId: string; rowData: TableData[] };

interface Props {
  rows: TableRowType[];
  colWidths: string[];
}

const TableBody: React.FC<Props> = ({ rows, colWidths }) => {
  return (
    <div>
      {rows.map((row) => (
        <TableRow cells={row.rowData} colWidths={colWidths} key={row.rowId} data-id={row.rowId} />
      ))}
    </div>
  );
};

export default TableBody;
