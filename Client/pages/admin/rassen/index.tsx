import { nanoid } from "nanoid";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { GrEdit, GrView } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import Dashboard from "../../../components/admin/dashboard";
import Button from "../../../components/buttons/Button";
import FormRow from "../../../components/form/FormRow";
import FormSearch from "../../../components/form/FormSearch";
import Table from "../../../components/Table/Table";
import getData from "../../../hooks/useApi";
import { PaginatedRas } from "../../../middleware/mappers/rassen";
import { ADMIN_RASSEN_OVERIEW } from "../../../types/apiTypes";
import { ApiResult } from "../klanten";

const Rassen = () => {
  const router = useRouter();
  const [apiData, setApiData] = useState<ApiResult<PaginatedRas>>({
    data: [],
    pagination: { first: 0, last: 0, total: 0, currentPage: 0 },
  });
  const headers: string[] = ["naam", "soort", "actions"];

  const handleView = (id: string) => {
    router.push(`admin/rassen/${id}`);
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await getData(ADMIN_RASSEN_OVERIEW);
      if (data) setApiData(data);
      if (error) toast.error("Error bij ophalen van rassen overzicht");
    })();
  }, []);

  const rassen = useMemo(() => {
    return apiData.data.map((ras) => {
      const naam = <Link href={`/admin/rassen/${ras._id}`}>{ras.naam}</Link>;
      const soort = ras.soort;
      const actions = [
        <div
          className="border rounded-l border-grey-200 border-solid p-1 cursor-pointer"
          key={nanoid(10)}
        >
          <GrView onClick={() => handleView(ras._id.toString())} />
        </div>,
        <div
          className="border border-grey-200 border-solid p-1 cursor-pointer"
          key={nanoid(10)}
        >
          <GrEdit />
        </div>,
        <div
          className="border rounded-r border-grey-200 border-solid p-1 cursor-pointer"
          key={nanoid(10)}
        >
          <MdDelete />
        </div>,
      ];

      return [naam, soort, actions];
    });
  }, [apiData]);

  const onPaginationClick = async (api?: string) => {
    if (!api) return;
    const { data, error } = await getData(api);
    if (data) setApiData(data);
    if (error) toast.warning("Fout bij laden van rassen");
  };
  return (
    <Dashboard>
      <FormRow className="mb-5">
        <Button label="ras toevoegen" className="flex items-center" />
        <FormSearch api="/admin/rassen" onSearch={() => {}} />
      </FormRow>
      <Table
        rows={rassen}
        columns={headers}
        colWidths={["40", "35", "25"]}
        onPaginationClick={onPaginationClick}
        pagination={apiData.pagination}
      />
    </Dashboard>
  );
};

export default Rassen;
