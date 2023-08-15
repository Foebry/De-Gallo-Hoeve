import Dashboard from 'src/components/admin/dashboard';
import Button from 'src/components/buttons/Button';
import { geslachten } from 'src/components/Cards/HondCard';
import FormInput from 'src/components/form/FormInput';
import FormRow from 'src/components/form/FormRow';
import { MySelect } from 'src/components/MySelect';
import moment from 'moment';
import { useRouter } from 'next/router';
import { HondDetailResponse } from 'src/pages/api/admin/honden/[slug].page';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHondContext } from 'src/context/app/hondContext';
import { useRasContext } from 'src/context/app/RasContext';
import Head from 'next/head';
import Spinner from 'src/components/loaders/Spinner';

const HondDetail = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { editMode, slug: id } = router.query as { editMode: string; slug: string };
  const { useGetHondDetail } = useHondContext();
  const { useGetRasOptions } = useRasContext();

  const [edit, setEdit] = useState<boolean>(editMode ? true : false);
  const { data: rassen, isLoading: isRassenLoading } = useGetRasOptions();
  const { data: hondDetail, isLoading: isHondDetailLoading } = useGetHondDetail(id);

  useEffect(() => {
    setIsLoading(isRassenLoading && isHondDetailLoading);
  }, [isRassenLoading, isHondDetailLoading]);

  const { control, handleSubmit } = useForm<HondDetailResponse>();

  return (
    <>
      <Head>
        <title>De Gallo-hoeve - Honddetail</title>
      </Head>
      <Dashboard>
        {isLoading && <Spinner />}
        {!isLoading && (
          <>
            <FormRow className="flex-row-reverse mb-10">
              {edit ? (
                <Button label={'save'} onClick={() => setEdit(false)} />
              ) : (
                <Button label="edit" onClick={() => setEdit(true)} />
              )}
            </FormRow>
            <FormRow>
              <Controller
                name="naam"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    name="naam"
                    id="naam"
                    label="naam"
                    onChange={onChange}
                    value={value ?? hondDetail?.naam ?? ''}
                    disabled={!edit}
                  />
                )}
              />
              <Controller
                name="ras.naam"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <MySelect
                    name="ras"
                    options={rassen}
                    value={value ?? rassen?.find((rasOption) => rasOption.value === hondDetail?.ras.id)}
                    onChange={onChange}
                    disabled={!edit}
                  />
                )}
              />
            </FormRow>
            <FormRow className="mt-48">
              <Controller
                name="geslacht"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <MySelect
                    name="geslacht"
                    label="geslacht"
                    onChange={onChange}
                    value={value ?? geslachten.find((geslacht) => geslacht.label === hondDetail?.geslacht)}
                    disabled={!edit}
                    options={geslachten}
                  />
                )}
              />
              <Controller
                name="geboortedatum"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    name="geboortedatum"
                    id="geboortedatum"
                    label="geboortedatum"
                    onChange={onChange}
                    value={moment(value ?? hondDetail?.geboortedatum).format('DD/MM/YYYY') ?? ''}
                    disabled={!edit}
                  />
                )}
              />
            </FormRow>
            <FormRow className="mt-48">
              <Controller
                name="eigenaar.fullName"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    name="eigenaar"
                    id="eigenaar"
                    label="eigenaar"
                    onChange={onChange}
                    value={value ?? `${hondDetail?.klant.vnaam} ${hondDetail?.klant.lnaam}` ?? ''}
                    disabled={true}
                  />
                )}
              />
            </FormRow>
          </>
        )}
      </Dashboard>
    </>
  );
};

export default HondDetail;
