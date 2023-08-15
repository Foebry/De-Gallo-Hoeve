import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { VacationDto } from 'src/common/api/dtos/VacationDto';
import Dashboard from 'src/components/admin/dashboard';
import Button from 'src/components/buttons/Button';
import Form from 'src/components/form/Form';
import FormRow from 'src/components/form/FormRow';
import Spinner from 'src/components/loaders/Spinner';
import { Title2 } from 'src/components/Typography/Typography';
import { useVacationContext } from 'src/context/VacationContext';
import Details from '../components/-details';
import { FormType } from '../create/index.page';
import { MdEdit } from 'react-icons/md';

interface Props {}

const DetailsPage: React.FC<Props> = ({}) => {
  const router = useRouter();
  const { getVacationById, updateVacation } = useVacationContext();

  const [vacationData, setVacationData] = useState<VacationDto>();
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);

  const { control, getValues, setValue, handleSubmit } = useForm<FormType>({
    defaultValues: {
      ...vacationData,
      duration: {
        startDate: vacationData?.duration.from,
        endDate: vacationData?.duration.to,
      },
    },
  });

  useEffect(() => {
    (async () => {
      if (!router.isReady) return;
      const { slug: id } = router.query as { slug: string };
      const dto = await getVacationById(id);
      setVacationData(dto);
      setLoading(false);
    })();
  }, [router, getVacationById]);

  useEffect(() => {
    if (!vacationData) return;
    setValue('duration', {
      from: vacationData.duration.from.split(' ')[0],
      to: vacationData.duration.to.split(' ')[0],
      startDate: vacationData.duration.from.split(' ')[0],
      endDate: vacationData.duration.to,
    });
    setValue('notificationStartDate', vacationData.notificationStartDate.split(' ')[0]);
  }, [vacationData]);

  const onSubmit = async (values: FieldValues) => {
    if (!editMode || !vacationData) return;
    const dto = {
      ...vacationData,
      duration: values.duration,
      notificationStartDate:
        typeof values.notificationStartData === 'string'
          ? values.notificationStartDate
          : values.notificationStartDate[0],
    };
    await updateVacation(dto);
  };

  return (
    <Dashboard>
      {loading && <Spinner />}
      {!loading && (
        <>
          {!editMode && (
            <FormRow className="flex-row-reverse">
              <Button
                label={
                  <span className="flex items-center gap-1">
                    <MdEdit />
                    <span>Edit</span>
                  </span>
                }
                onClick={() => setEditMode(true)}
              />
            </FormRow>
          )}
          <Title2>Vacation-details</Title2>
          <div className="border-2 rounded mt-20 max-w-2xl mx-auto px-10">
            <Form onSubmit={handleSubmit(onSubmit)} action={editMode ? 'verstuur' : undefined}>
              <Details control={control} getValues={getValues} disabled={!editMode} />
            </Form>
          </div>
        </>
      )}
    </Dashboard>
  );
};

export default DetailsPage;
