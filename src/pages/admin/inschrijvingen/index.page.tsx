import { nanoid } from 'nanoid';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import { GrEdit, GrView } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { InschrijvingDto } from 'src/common/api/types/inschrijving';
import Dashboard from 'src/components/admin/dashboard';
import FormRow from 'src/components/form/FormRow';
import Spinner from 'src/components/loaders/Spinner';
import Table from 'src/components/Table/Table';
import { useInschrijvingContext } from 'src/context/app/InschrijvingContext';
import { PaginatedData } from 'src/shared/RequestHelper';
import { apiOptionsInterface } from '../klanten/index.page';

const Inschrijvingen = () => {
  const headers: string[] = [
    'datum',
    'training',
    'klant',
    'hond',
    'aangemaakt op',
    'actions',
  ];
  const { useGetPaginatedInschrijvingen } = useInschrijvingContext();
  const [options, setOptions] = useState<apiOptionsInterface>({});
  const [url, setUrl] = useState<string>();
  const router = useRouter();

  const { data: inschrijvingData, isLoading } = useGetPaginatedInschrijvingen(
    url,
    undefined
  );
  const rows = useMemo(
    () => createTableFromData(inschrijvingData, router),
    [inschrijvingData, router]
  );

  const onPaginationClick = async (api?: string) => {
    if (!api) return;
    setUrl(api);
  };

  return (
    <Dashboard>
      {isLoading && <Spinner />}
      {!isLoading && (
        <Table
          rows={rows}
          columns={headers}
          colWidths={['15', '10', '12.5', '12.5', '10', '15']}
          pagination={inschrijvingData.pagination}
          onPaginationClick={onPaginationClick}
        />
      )}
    </Dashboard>
  );
};

export default Inschrijvingen;

const createTableFromData = (
  { data }: PaginatedData<InschrijvingDto>,
  router: NextRouter
) => {
  const handleView = (_id: string) => {
    router.push(`/admin/inschrijvingen/${_id}`);
  };

  return data.map((inschrijving) => {
    const datum = (
      <Link href={`/admin/inschrijvingen/${inschrijving.id}`}>{inschrijving.datum}</Link>
    );
    const training = inschrijving.training;
    const klant = (
      <Link href={`/admin/klanten/${inschrijving.klant.id}`}>
        {`${inschrijving.klant.vnaam} ${inschrijving.klant.lnaam}`}
      </Link>
    );
    const hond = (
      <Link href={`/admin/honden/${inschrijving.hond.id}`}>{inschrijving.hond.naam}</Link>
    );
    const ingeschrevenOp = inschrijving.created_at;
    const actions = [
      <div
        className="border rounded-l border-grey-200 border-solid p-1 cursor-pointer"
        key={nanoid(10)}
      >
        <GrView onClick={() => handleView?.(inschrijving.id)} />
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
};
