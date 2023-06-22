import { nanoid } from 'nanoid';
import React, { useMemo, useState } from 'react';
import { GrEdit } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import Dashboard from 'src/components/admin/dashboard';
import Button from 'src/components/buttons/Button';
import FormRow from 'src/components/form/FormRow';
import FormSearch from 'src/components/form/FormSearch';
import Table from 'src/components/Table/Table';
import { AiOutlinePlus } from 'react-icons/ai';
import { useRasContext } from 'src/context/app/RasContext';
import { PaginatedData } from 'src/shared/RequestHelper';
import { RasDto } from 'src/common/api/types/ras';
import Spinner from 'src/components/loaders/Spinner';

const Rassen = () => {
  const { useGetPaginatedRassen } = useRasContext();
  const [url, setUrl] = useState<string>();

  const { data: paginatedData, isLoading } = useGetPaginatedRassen(url);
  const headers: string[] = ['naam', 'soort', 'actions'];

  const rows = useMemo(() => {
    return createTableFromData(paginatedData);
  }, [paginatedData]);

  const onPaginationClick = async (api?: string) => {
    if (!api) return;
    setUrl(api);
  };

  const onSearch = async (searchValue: string) => {
    setUrl(`/api/admin/rassen?search=${searchValue}`);
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
      {isLoading && <Spinner />}
      {!isLoading && (
        <Table
          rows={rows}
          columns={headers}
          colWidths={['50', '35', '15']}
          onPaginationClick={onPaginationClick}
          pagination={paginatedData.pagination}
        />
      )}
    </Dashboard>
  );
};

export default Rassen;

const createTableFromData = (data: PaginatedData<RasDto> | undefined) => {
  return (
    data?.data.map((ras) => {
      const naam = ras.naam;
      const soort = ras.soort;
      const actions = [
        <div
          className="border rounded-l border-grey-200 border-solid p-1 cursor-pointer"
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
    }) ?? []
  );
};
