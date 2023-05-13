import { TrainingDayDto } from '@/types/DtoTypes/TrainingDto';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { GrEdit, GrView } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import Dashboard from 'src/components/admin/dashboard';
import FormRow from 'src/components/form/FormRow';
import Table from 'src/components/Table/Table';
import getData from 'src/hooks/useApi';
import { PaginatedInschrijving } from 'src/mappers/Inschrijvingen';
import { ADMIN_INSCHRIJVINGEN_OVERVIEW } from 'src/types/apiTypes';
import { apiOptionsInterface, ApiResult } from '../klanten/index.page';

const Inschrijvingen = () => {
  const headers: string[] = [
    'datum',
    'training',
    'klant',
    'hond',
    'aangemaakt op',
    'actions',
  ];
  const [options, setOptions] = useState<apiOptionsInterface>({});
  const [apiData, setApiData] = useState<ApiResult<PaginatedInschrijving>>({
    data: [],
    pagination: { first: 0, last: 0, total: 0, currentPage: 0 },
  });
  const router = useRouter();

  const handleView = (_id: string) => {
    router.push(`/admin/inschrijvingen/${_id}`);
  };

  useEffect(() => {
    (async () => {
      const ids = router.query.id;
      const url = ids
        ? ADMIN_INSCHRIJVINGEN_OVERVIEW + `?id=${ids}`
        : ADMIN_INSCHRIJVINGEN_OVERVIEW;
      const { data } = await getData<ApiResult<PaginatedInschrijving>>(url);
      // setApiData(data.map((trainingDayDto: TrainingDayDto) => trainingDayDto.date));
      if (data) setApiData(data);
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
    const { data, error } = await getData<ApiResult<PaginatedInschrijving>>(api);
    if (!error && data) {
      setApiData(data);
    }
    if (error) {
      toast.warning('Fout bij laden van inschrijvingen');
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
        colWidths={['15', '10', '12.5', '12.5', '10', '15']}
        pagination={apiData.pagination}
        onPaginationClick={onPaginationClick}
      />
    </Dashboard>
  );
};

export default Inschrijvingen;
