import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Dashboard from "src/components/admin/dashboard";
import Table from "src/components/Table/Table";
import { PaginatedResponse } from "src/helpers/RequestHelper";
import getData from "src/hooks/useApi";
import { PaginatedKlantHond } from "src/mappers/honden";
import { ADMIN_HONDEN_OVERVIEW } from "src/types/apiTypes";

const Index = () => {
  const headers = [
    "naam",
    "ras",
    "geslacht",
    "klant",
    "aangemaakt op",
    "aangepast op",
    "actions",
  ];
  const [apiData, setApiData] = useState<PaginatedResponse<PaginatedKlantHond>>(
    {
      data: [],
      pagination: { first: 0, last: 0, total: 0, currentPage: 0 },
    }
  );

  useEffect(() => {
    (async () => {
      const { data, error } = await getData(ADMIN_HONDEN_OVERVIEW);
      if (data) setApiData(data);
      if (error) toast.warning("Error bij ophalen van honden overzicht");
    })();
  }, []);

  const rows = useMemo(() => {
    return apiData.data.map((klantHond) => {
      const naam = (
        <Link href={`/admin/honden/${klantHond._id}`}>{klantHond.naam}</Link>
      );
      const ras = (
        <Link href={`/admin/rassen/${klantHond.ras}`}>{klantHond.ras}</Link>
      );
      const klant = (
        <Link href={`/admin/klanten/${klantHond.klant._id}`}>
          {klantHond.klant.naam}
        </Link>
      );
      const geslacht = klantHond.geslacht;
      const created_at = klantHond.created_at;
      const updated_at = klantHond.updated_at;

      return [naam, ras, geslacht, klant, created_at, updated_at, []];
    });
  }, [apiData]);

  const onPaginationClick = async (api?: string) => {
    if (!api) return;
    const { data, error } = await getData(api);
    if (data) setApiData(data);
    if (error) toast.warning("Fout bij laden van honden");
  };

  return (
    <Dashboard>
      <Table
        colWidths={["15", "17.5", "10", "17.5", "15", "15", "10"]}
        columns={headers}
        rows={rows}
        pagination={apiData?.pagination}
        onPaginationClick={onPaginationClick}
      />
    </Dashboard>
  );
};

export default Index;
