import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import Dashboard from 'src/components/admin/dashboard';
import Table from 'src/components/Table/Table';
import getData from 'src/hooks/useApi';
import { ADMIN_KLANTEN_OVERVIEW } from 'src/types/apiTypes';
import { GrView, GrEdit } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { useRouter } from 'next/router';
import FormRow from 'src/components/form/FormRow';
import FormSearch from 'src/components/form/FormSearch';
import { toast } from 'react-toastify';
import { PaginationInterface } from 'src/components/Table/Table';
import { nanoid } from 'nanoid';
import { PaginatedKlant } from 'src/mappers/klanten';
import Head from 'next/head';
import Button from 'src/components/buttons/Button';
import useMutation from 'src/hooks/useMutation';
import useApi from 'src/hooks/useApi';
import { REQUEST_METHOD } from 'src/utils/axios';

export type apiOptionsInterface = Partial<{
  page: number;
  amount: number;
}>;

export interface ApiResult<T> {
  data: T[];
  pagination: PaginationInterface;
}

const Klanten = () => {
  const headers: string[] = [
    'naam',
    'email',
    'adres',
    'verifieerd',
    'geregistreerd',
    'actions',
  ];
  const [options, setOptions] = useState<apiOptionsInterface>({});
  const [apiData, setApiData] = useState<ApiResult<PaginatedKlant>>({
    data: [],
    pagination: { first: 0, last: 0, total: 0, currentPage: 0 },
  });
  const router = useRouter();
  const sendManualFeedbackMails = useMutation<{}>('/api/cron/sendManualFeedbackMails');

  const handleView = (_id: string) => {
    router.push(`/admin/klanten/${_id}`);
  };

  useEffect(() => {
    (async () => {
      const { data } = await getData<ApiResult<PaginatedKlant>>(
        ADMIN_KLANTEN_OVERVIEW,
        options
      );
      setApiData(data!);
    })();
  }, [options]);

  const klanten = useMemo(() => {
    return apiData.data.map((klant: PaginatedKlant) => {
      const naam = (
        <Link href={`/admin/klanten/${klant._id}`}>
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
          <GrView onClick={() => handleView(klant._id.toString())} />
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
  }, [apiData]);

  const onSearch = async (searchValue: string) => {
    const { data, error } = await getData<ApiResult<PaginatedKlant>>(
      `/api/admin/klanten?search=${searchValue}`
    );
    if (!error && data) {
      setApiData(data);
    }
    if (error) {
      toast.warning('Zoek opdracht mislukt');
    }
  };

  const onPaginationClick = async (api?: string) => {
    if (!api) return;
    const { data, error } = await getData<ApiResult<PaginatedKlant>>(api);
    if (!error && data) {
      setApiData(data);
    }
    if (error) {
      toast.warning('Fout bij laden van klanten');
    }
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
        <Table
          rows={klanten}
          columns={headers}
          colWidths={['15', '25', '22.5', '15', '12.5', '10']}
          pagination={apiData.pagination}
          onPaginationClick={onPaginationClick}
        />
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
