import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import Dashboard from 'src/components/admin/dashboard';
import Table from 'src/components/Table/Table';
import { GrView, GrEdit } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { NextRouter, useRouter } from 'next/router';
import FormRow from 'src/components/form/FormRow';
import FormSearch from 'src/components/form/FormSearch';
import { toast } from 'react-toastify';
import { PaginationInterface } from 'src/components/Table/Table';
import { nanoid } from 'nanoid';
import Head from 'next/head';
import useMutation from 'src/hooks/useMutation';
import { REQUEST_METHOD } from 'src/utils/axios';
import { useKlantContext } from 'src/context/app/klantContext';
import { PaginatedData } from 'src/shared/RequestHelper';
import { KlantDto } from 'src/common/api/types/klant';
import Spinner from 'src/components/loaders/Spinner';

export type apiOptionsInterface = Partial<{
  page: number;
  amount: number;
}>;

export interface ApiResult<T> {
  data: T[];
  pagination: PaginationInterface;
}

const Klanten = () => {
  const [url, setUrl] = useState<string>();
  const headers: string[] = [
    'naam',
    'email',
    'adres',
    'verifieerd',
    'geregistreerd',
    'actions',
  ];
  const router = useRouter();
  const { useGetPaginatedKlanten } = useKlantContext();
  const { data: paginatedKlanten, isLoading } = useGetPaginatedKlanten(undefined, url);

  const rows = useMemo(() => {
    return createTableFromData(paginatedKlanten, router);
  }, [paginatedKlanten, router]);

  const sendManualFeedbackMails = useMutation<{}>('/api/cron/sendManualFeedbackMails');

  const onSearch = async (searchValue: string) => {
    setUrl(`/api/admin/klanten?search=${searchValue}`);
  };

  const onPaginationClick = async (api?: string) => {
    if (!api) return;
    setUrl(api);
  };

  const onClickSendEmails = async () => {
    try {
      const { data, error } = await sendManualFeedbackMails(
        {},
        { method: REQUEST_METHOD.GET }
      );
      if (data) toast.success('emails verzonden');
      if (error) toast.error(error.message);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <Head>
        <title>De Gallo-hoeve - Klanten</title>
      </Head>
      <Dashboard>
        <FormRow className="flex-row-reverse">
          <FormSearch api="/api/admin/klanten?search=" onSearch={onSearch} />
          {/* <Button
            label="verzend feedback mails"
            className="mb-2"
            onClick={onClickSendEmails}
          /> */}
        </FormRow>
        {isLoading && <Spinner />}
        {!isLoading && (
          <Table
            rows={rows}
            columns={headers}
            colWidths={['15', '25', '22.5', '15', '12.5', '10']}
            pagination={paginatedKlanten.pagination}
            onPaginationClick={onPaginationClick}
          />
        )}
      </Dashboard>
    </>
  );
};

export default Klanten;

const Verified: React.FC<{ verified: boolean }> = ({ verified }) => {
  const bgColor = verified ? 'bg-green-500' : 'bg-red-200';
  const borderColor = verified ? 'border-green-500' : 'border-red-200';
  return (
    <span
      className={`capitalize text-gray-200 ${bgColor} border-1 ${borderColor} border-solid rounded-2xl px-3 py-1`}
    >
      {verified ? 'verified' : 'not-verified'}
    </span>
  );
};

const createTableFromData = (data: PaginatedData<KlantDto>, router: NextRouter) => {
  const handleView = (id: string) => {
    router.push(`/admin/klanten/${id}`);
  };

  return data.data.map((klant: KlantDto) => {
    const naam = (
      <Link href={`/admin/klanten/${klant.id}`}>
        {[klant.vnaam, klant.lnaam].join(' ')}
      </Link>
    );
    const verified = <Verified verified={klant.verified} />;
    const registered = klant.created_at ?? 'onbekend';
    const address = [
      klant.straat,
      `${klant.nr}${klant.bus ?? ''}`,
      klant.gemeente,
      klant.postcode,
    ].join(' ');
    const actions = [
      <div
        className="border rounded-l border-grey-200 border-solid p-1 cursor-pointer"
        key={nanoid(10)}
      >
        <GrView onClick={() => handleView(klant.id)} />
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
    return [naam, klant.email, address, verified, registered, actions];
  });
};
