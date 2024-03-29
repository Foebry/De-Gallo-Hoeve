import { VACATIONS_OVERVIEW } from '@/types/apiTypes';
import { nanoid } from 'nanoid';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { GrEdit, GrView } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { VacationDto } from 'src/common/api/dtos/VacationDto';
import Dashboard from 'src/components/admin/dashboard';
import Button from 'src/components/buttons/Button';
import FormRow from 'src/components/form/FormRow';
import { ModalType } from 'src/components/Modal/Modal/BaseModal';
import Table from 'src/components/Table/Table';
import { Body } from 'src/components/Typography/Typography';
import { ModalContext, ModalData } from 'src/context/ModalContext';
import { useVacationContext } from 'src/context/VacationContext';
import getData from 'src/hooks/useApi';
import { apiOptionsInterface, ApiResult } from '../klanten/index.page';

interface Props {}

const Vakanties: React.FC<Props> = ({}) => {
  const router = useRouter();
  const headers = [
    'startDatum',
    'eindDatum',
    'notificaties-startDatum',
    'aangemaakt op',
    'aangepast op',
    'actions',
  ];

  const { updateModal, openModal } = useContext(ModalContext);
  const { deleteVacation, getVacationList } = useVacationContext();
  const [options, setOptions] = useState<apiOptionsInterface>({});
  const [apiData, setApiData] = useState<ApiResult<VacationDto>>({
    data: [],
    pagination: { first: 0, last: 0, total: 0, currentPage: 0 },
  });

  useEffect(() => {
    (async () => {
      const data = await getVacationList();
      if (data) setApiData(data);
    })();
  }, [deleteVacation]);

  const handleView = (id: string) => {
    router.push(`/admin/vakanties/${id}`);
  };

  const modalContent = useMemo(() => {
    return (
      <div>
        <Body>Je staat op het punt om een vakantie-periode te verwijderen.</Body>
        <Body>Als je zeker bent, klik op doorgaan.</Body>
      </div>
    );
  }, []);

  const onDelete = (id: string) => {
    const modalData: ModalData = {
      type: ModalType.ERROR,
      caption: 'Ben je zeker?',
      content: modalContent,
      callbackData: id,
    };

    updateModal(modalData, () => deleteVacation);
    openModal();
  };

  const rows = useMemo(() => {
    return apiData?.data.map((row: VacationDto) => {
      const startDate = (
        <Link href={`/admin/vakanties/${row.id}`}>{row.duration.from}</Link>
      );
      const endDate = row.duration.to;
      const notificationStartDate = row.notificationStartDate;
      const createdAt = row.createdAt;
      const editedAt = row.updatedAt;
      const actions = [
        <div
          className="border rounded-l border-grey-200 border-solid p-1 cursor-pointer"
          key={nanoid(10)}
        >
          <GrView onClick={() => handleView(row.id)} />
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
          <MdDelete onClick={() => onDelete(row.id)} />
        </div>,
      ];
      return [startDate, endDate, notificationStartDate, createdAt, editedAt, actions];
    });
  }, [apiData]);

  const onPageChange = async (api?: string) => {
    if (!api) return;
    const { data, error } = await getData(api);
    if (!error && data) {
      setApiData(data);
    }
    if (error) {
      toast.warning('Fout bij laden van vakantie-instellingen');
    }
  };

  const onClick = () => {
    router.push('/admin/vakanties/create');
  };

  return (
    <>
      <Head>
        <title>De gallo-hoeve - Vakanties</title>
      </Head>
      <Dashboard>
        <FormRow className="flex-row-reverse mb-10">
          <Button
            label={
              <span className="flex items-center">
                <AiOutlinePlus />
                <span className="ml-1">toevoegen</span>
              </span>
            }
            onClick={onClick}
          />
        </FormRow>
        <Table
          colWidths={['15', '17.5', '25', '17.5', '15', '10']}
          columns={headers}
          rows={rows}
          pagination={apiData?.pagination}
          onPaginationClick={onPageChange}
        />
      </Dashboard>
    </>
  );
};

export default Vakanties;
