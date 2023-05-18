import React, { ReactNode } from 'react';
import { Body } from '../Typography/Typography';
import TableBody from './TableBody';
import TableHead from './TableHead';
import TablePagination from './TablePagination';

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
      {rows.length > 0 && <TableBody rows={rows} colWidths={colWidths} />}
      {rows.length === 0 && (
        <Body className="py-5 text-center">Geen gegevens gevonden</Body>
      )}
      {pagination && (
        <TablePagination pagination={pagination} onClick={onPaginationClick} />
      )}
    </>
  );
};

export default Table;
