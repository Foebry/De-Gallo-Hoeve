import { VACATIONS_OVERVIEW } from '@/types/apiTypes';
import { VacationDto } from '@/types/DtoTypes/VacationDto';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import { GrEdit, GrView } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import Dashboard from 'src/components/admin/dashboard';
import Button from 'src/components/buttons/Button';
import FormRow from 'src/components/form/FormRow';
import Table from 'src/components/Table/Table';
import { ModalContext } from 'src/context/ModalContext';
import getData from 'src/hooks/useApi';
import { toReadableDate } from 'src/shared/functions';
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

  const { updateModal } = useContext(ModalContext);
  const [options, setOptions] = useState<apiOptionsInterface>({});
  const [apiData, setApiData] = useState<ApiResult<VacationDto>>({
    data: [],
    pagination: { first: 0, last: 0, total: 0, currentPage: 0 },
  });

  useEffect(() => {
    (async () => {
      const { data } = await getData(VACATIONS_OVERVIEW, options);
      setApiData(data);
    })();
  }, []);

  const handleView = (id: string) => {
    router.push(`/admin/vakanties/${id}`);
  };

  const rows = useMemo(() => {
    return apiData.data.map((row: VacationDto) => {
      const startDate = (
        <Link href={`/admin/vakanties/${row.id}`}>{row.duration.startDate}</Link>
      );
      const endDate = row.duration.endDate;
      const notificationStartDate = row.notificationStartDate;
      const createdAt = row.created_at;
      const editedAt = row.updated_at;
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
          <MdDelete />
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
    <Dashboard>
      <FormRow className="flex-row-reverse mb-10">
        <Button label="Nieuwe vakantie aanmaken" onClick={onClick} />
      </FormRow>
      <Table
        colWidths={['15', '17.5', '25', '17.5', '15', '10']}
        columns={headers}
        rows={rows}
        pagination={apiData?.pagination}
        onPaginationClick={onPageChange}
      />
    </Dashboard>
  );
};

export default Vakanties;
