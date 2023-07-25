import { VacationDto } from '@/types/DtoTypes/VacationDto';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { GrEdit, GrView } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import Dashboard from 'src/components/admin/dashboard';
import Table from 'src/components/Table/Table';
import { string } from 'yup';

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

  const apiData = {
    data: [
      {
        id: 'abc',
        startDate: '16-07-2023',
        endDate: '23-07-2023',
        notificationStartDate: '09-07-2023',
        longDescription: '',
        notificationDescription: '',
      },
    ],
    pagination: { first: 1, last: 1, total: 1, currentPage: 1 },
  };

  const handleView = (id: string) => {
    router.push(`/admin/vakanties/${id}`);
  };

  const rows = useMemo(() => {
    return apiData.data.map((row: VacationDto) => {
      const startDate = (
        <Link href={`/admin/vakanties/${row.id}`}>{row.startDate.toString()}</Link>
      );
      const endDate = row.endDate;
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
          <MdDelete />
        </div>,
      ];
      return [startDate, endDate, notificationStartDate, createdAt, editedAt, actions];
    });
  }, [apiData]);
  const onPageChange = async () => {};
  return (
    <Dashboard>
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
