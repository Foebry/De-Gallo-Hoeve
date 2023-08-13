import React, { ReactNode } from 'react';
import { Pagination } from 'src/common/api/shared/types';
import { Body } from '../Typography/Typography';
import TableBody from './TableBody';
import TableHead from './TableHead';
import TablePagination from './TablePagination';

type TableData = string | ReactNode;
export type TableRow = TableData[];

interface Props {
  rows: TableRow[];
  columns: string[];
  colWidths: string[];
  pagination?: Pagination;
  onPaginationClick: (page?: number) => Promise<void>;
}

const Table: React.FC<Props> = ({ rows, columns, colWidths, pagination, onPaginationClick }) => {
  return (
    <>
      <TableHead cols={columns} colWidths={colWidths} />
      {rows.length > 0 && <TableBody rows={rows} colWidths={colWidths} />}
      {rows.length === 0 && <Body className="py-5 text-center">Geen gegevens gevonden</Body>}
      {pagination && <TablePagination pagination={pagination} onClick={onPaginationClick} />}
    </>
  );
};

export default Table;
