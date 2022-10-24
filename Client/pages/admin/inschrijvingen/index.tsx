import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { GrEdit, GrView } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import Dashboard from "../../../components/admin/dashboard";
import FormRow from "../../../components/form/FormRow";
import Table from "../../../components/Table/Table";
import { Title1 } from "../../../components/Typography/Typography";
import getData from "../../../hooks/useApi";
import { PaginatedInschrijving } from "../../../middleware/mappers/Inschrijvingen";
import { ADMIN_INSCHRIJVINGEN_OVERVIEW } from "../../../types/apiTypes";
import { apiOptionsInterface, ApiResult } from "../klanten";

const Inschrijvingen = () => {
  const headers: string[] = [
    "datum",
    "training",
    "klant",
    "hond",
    "aangemaakt op",
    "actions",
  ];
  const [options, setOptions] = useState<apiOptionsInterface>({});
  const [apiData, setApiData] = useState<ApiResult<PaginatedInschrijving>>({
    data: [],
    pagination: { first: 0, last: 0, total: 0, currentPage: 0 },
  });
  const router = useRouter();
  console.log({ query: router.query });

  const handleView = (_id: string) => {
    router.push(`/admin/inschrijvingen/${_id}`);
  };

  useEffect(() => {
    (async () => {
      const ids = router.query.id;
      console.log(ids);
      const url = ids
        ? ADMIN_INSCHRIJVINGEN_OVERVIEW + `?id=${ids}`
        : ADMIN_INSCHRIJVINGEN_OVERVIEW;
      console.log(url);
      const { data } = await getData(url);
      setApiData(data);
    })();
  }, [router.query.id]);

  const inschrijvingen = useMemo(() => {
    return apiData.data.map((inschrijving) => {
      const datum = (
        <Link href={`/admin/inschrijvingen/${inschrijving._id}`}>
          {inschrijving.datum}
        </Link>
      );
      const training = inschrijving.training;
      const klant = (
        <Link href={`/admin/klanten/${inschrijving.klant._id}`}>
          {inschrijving.klant.naam}
        </Link>
      );
      const hond = (
        <Link href={`/admin/honden/${inschrijving.hond._id}`}>
          {inschrijving.hond.naam}
        </Link>
      );
      const ingeschrevenOp = inschrijving.created_at;
      const actions = [
        <div
          className="border rounded-l border-grey-200 border-solid p-1 cursor-pointer"
          key={nanoid(10)}
        >
          <GrView onClick={() => handleView(inschrijving._id)} />
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
      return [datum, training, klant, hond, ingeschrevenOp, actions];
    });
  }, [apiData]);

  const onPaginationClick = async (api?: string) => {
    if (!api) return;
    const { data, error } = await getData(api);
    if (!error && data) {
      setApiData(data);
    }
    if (error) {
      toast.warning("Fout bij laden van inschrijvingen");
    }
  };
  return (
    <Dashboard>
      <FormRow className="">
        <div></div>
      </FormRow>
      <Table
        rows={inschrijvingen}
        columns={headers}
        colWidths={["15", "10", "12.5", "12.5", "10", "15"]}
        pagination={apiData.pagination}
        onPaginationClick={onPaginationClick}
      />
    </Dashboard>
  );
};

export default Inschrijvingen;
