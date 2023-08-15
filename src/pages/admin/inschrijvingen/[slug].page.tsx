import { useRouter } from 'next/router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InschrijvingDto } from 'src/common/api/types/inschrijving';
import Dashboard from 'src/components/admin/dashboard';
import Button from 'src/components/buttons/Button';
import FormInput from 'src/components/form/FormInput';
import FormRow from 'src/components/form/FormRow';
import FormSection from 'src/components/form/FormSection';
import Spinner from 'src/components/loaders/Spinner';
import { useInschrijvingContext } from 'src/context/app/InschrijvingContext';

const InschrijvingDetail = () => {
  const router = useRouter();
  const id = router.query.slug as string;
  const { editMode } = router.query;

  const { useGetInschrijvingDetail } = useInschrijvingContext();
  const { data, isLoading } = useGetInschrijvingDetail(id);

  const [edit, setEdit] = useState<boolean>(editMode ? true : false);

  const { control, handleSubmit } = useForm<InschrijvingDto>();

  return (
    <Dashboard>
      {isLoading && <Spinner />}
      {!isLoading && data && (
        <>
          <FormRow className="flex-row-reverse mb-10">
            {edit ? (
              <Button label={'save'} onClick={() => setEdit(false)} />
            ) : (
              <Button label={'edit'} onClick={() => setEdit(true)} />
            )}
          </FormRow>
          <FormSection label="inschrijving gegevens">
            <FormRow className="items-center">
              <Controller
                name="datum"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    id="datum"
                    name="datum"
                    label="datum"
                    onChange={onChange}
                    value={value ?? data.datum ?? 'onbekend'}
                    disabled={true}
                  />
                )}
              />
              <Controller
                name="training"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    id="training"
                    name="training"
                    label="training"
                    onChange={onChange}
                    value={value ?? data.training ?? 'onbekend'}
                    disabled={true}
                  />
                )}
              />
              <Controller
                name="created_at"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    id="created_at"
                    name="created_at"
                    label="aangemaakt op"
                    onChange={onChange}
                    value={value ?? data.created_at ?? 'onbekend'}
                    disabled={true}
                  />
                )}
              />
            </FormRow>
          </FormSection>
          <FormSection label="klant gegevens">
            <FormRow className="items-center">
              <Controller
                name="klant.vnaam"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    id="vnaam"
                    label="voornaam"
                    name="klant.vnaam"
                    onChange={onChange}
                    value={value ?? data.klant?.vnaam ?? 'onbekend'}
                    disabled={true}
                  />
                )}
              />
              <Controller
                name="klant.lnaam"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    id="lnaam"
                    label="achternaam"
                    name="klant.lnaam"
                    onChange={onChange}
                    value={value ?? data.klant?.lnaam ?? 'onbekend'}
                    disabled={true}
                  />
                )}
              />
            </FormRow>
          </FormSection>
          <FormSection label="hond gegevens">
            <FormRow>
              <Controller
                name="hond.naam"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    id="naam"
                    label="naam"
                    name="hond.naam"
                    onChange={onChange}
                    value={value ?? data.hond?.naam ?? 'onbekend'}
                    disabled={true}
                  />
                )}
              />
              <Controller
                name="hond.ras"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    id="ras"
                    label="ras"
                    name="hond.ras"
                    onChange={onChange}
                    value={value ?? data.hond?.ras ?? 'onbekend'}
                    disabled={true}
                  />
                )}
              />
            </FormRow>
          </FormSection>
        </>
      )}
    </Dashboard>
  );
};

export default InschrijvingDetail;
