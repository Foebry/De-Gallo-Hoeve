import Dashboard from 'src/components/admin/dashboard';
import Details from '../components/-details';
import Form from 'src/components/form/Form';
import { FieldValues, useForm } from 'react-hook-form';
import { VacationDto } from '@/types/DtoTypes/VacationDto';
import { Body, Title1, Title3 } from 'src/components/Typography/Typography';
import Head from 'next/head';
import { useVacationContext } from 'src/context/VacationContext';
import FormRow from 'src/components/form/FormRow';
import Button, { SubmitButton } from 'src/components/buttons/Button';

type Props = {};
export type FormType = VacationDto & { duration: { from: string; to: string } };

const Create: React.FC<Props> = ({}) => {
  const { activateVacationNotification, saveVacation } = useVacationContext();

  const { handleSubmit, control, getValues } = useForm<FormType>();

  const onExample = () => {
    activateVacationNotification(getValues().duration);
  };

  const onSubmit = async (values: FieldValues) => {
    const { duration, notificationStartDate } = values;
    await saveVacation({ duration, notificationStartDate });
  };

  return (
    <>
      <Head>
        <title>De Gallo-hoeve - Vakantie aanmaken</title>
      </Head>
      <Dashboard>
        <Title1 className="text-green-200">Vakantie periode aanmaken</Title1>
        <div className="mx-auto text-center max-w-3xl">
          <Title3 className="text-green-200">Details van de vakantie-periode.</Title3>
          <Body>
            Geef hier de vakantie-periode aan door op de start -of einddatum te klikken en
            vervolgens de gewenste periode aan te duiden. De notificaties zullen standaard
            2 weken voor de start van de vakantie-periode starten.
          </Body>
          <Body>
            De notificatie start-datum kan gewijzigd worden wanneer een andere datum
            gewenst is.
          </Body>
          <Body>
            Klik tot slot op de Voorbeeld knop om te tonen hoe dit zal getoond worden
          </Body>
        </div>
        <div className="border-2 rounded mt-20 max-w-2xl mx-auto px-10">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Details control={control} getValues={getValues} />
            <FormRow className="mb-2">
              <Button label={'voorbeeld'} className="bg-blue-200" onClick={onExample} />
              <SubmitButton label="verzend" />
            </FormRow>
          </Form>
        </div>
      </Dashboard>
    </>
  );
};

export default Create;
