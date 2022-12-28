import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { GrEdit, GrView } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import Dashboard from "src/components/admin/dashboard";
import Button from "src/components/buttons/Button";
import FormRow from "src/components/form/FormRow";
import FormSearch from "src/components/form/FormSearch";
import Table from "src/components/Table/Table";
import getData from "src/hooks/useApi";
import { PaginatedRas } from "src/mappers/rassen";
import { ADMIN_RASSEN_OVERIEW } from "src/types/apiTypes";
import { ApiResult } from "../klanten/index.page";
import { AiOutlinePlus } from "react-icons/ai";

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

  const onSearch = async (searchValue: string) => {
    const { data, error } = await getData(
      `/api/admin/rassen?search=${searchValue}`
    );
    if (!error && data) {
      setApiData(data);
    }
    if (error) {
      toast.warning("Zoek opdracht mislukt");
    }
  };
  return (
    <Dashboard>
      <FormRow className="mb-5">
        <Button
          label={
            <span className="flex items-center">
              <AiOutlinePlus />
              <span className="ml-1">ras toevoegen</span>
            </span>
          }
          className="flex items-center"
        />
        <FormRow className="flex flex-row-reverse gap-10">
          <FormSearch api="/admin/rassen" onSearch={onSearch} />
        </FormRow>
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
