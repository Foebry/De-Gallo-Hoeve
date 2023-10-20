import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import Dashboard from 'src/components/admin/dashboard';
import Table, { TableRow } from 'src/components/Table/Table';
import { NextRouter, useRouter } from 'next/router';
import { useHondContext } from 'src/context/app/hondContext';
import { HondDto } from 'src/common/api/types/hond';
import Spinner from 'src/components/loaders/Spinner';
import { PaginatedData } from 'src/common/api/shared/types';
import { nanoid } from 'nanoid';

const Index = () => {
  const headers = ['naam', 'ras', 'geslacht', 'klant', 'aangemaakt op', 'aangepast op', 'actions'];
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const { useGetPaginatedHonden } = useHondContext();
  const { data: paginatedHonden, isLoading } = useGetPaginatedHonden({ page: page.toString() });

  const rows: TableRow[] = useMemo(() => {
    return createTableFromData(paginatedHonden, router);
  }, [paginatedHonden, router]);

  const onPaginationClick = async (page?: number) => {
    if (!page) return;
    setPage(page);
  };

  return (
    <Dashboard>
      {isLoading && <Spinner />}
      {!isLoading && (
        <Table
          colWidths={['15', '17.5', '10', '17.5', '15', '15', '10']}
          columns={headers}
          rows={rows}
          pagination={paginatedHonden.pagination}
          onPaginationClick={onPaginationClick}
        />
      )}
    </Dashboard>
  );
};

export default Index;

const createTableFromData = ({ data }: PaginatedData<HondDto>, router: NextRouter) => {
  const handleView = (id: string) => {
    router.push(`/admin/klanten/${id}`);
  };

  return data.map((klantHond) => {
    const naam = <Link href={`/admin/honden/${klantHond.id}`}>{klantHond.naam}</Link>;
    const ras = klantHond.ras.naam;
    const klant = (
      <Link href={`/admin/klanten/${klantHond.klant.id}`}>{`${klantHond.klant.vnaam} ${klantHond.klant.lnaam}`}</Link>
    );
    const geslacht = klantHond.geslacht;
    const created_at = klantHond.created_at;
    const updated_at = klantHond.updated_at;

    return { rowId: nanoid(), rowData: [naam, ras, geslacht, klant, created_at, updated_at, []] };
  });
};
