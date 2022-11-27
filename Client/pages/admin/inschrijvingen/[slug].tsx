import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Dashboard from "../../../components/admin/dashboard";
import Button from "../../../components/buttons/Button";
import FormInput from "../../../components/form/FormInput";
import FormRow from "../../../components/form/FormRow";
import FormSection from "../../../components/form/FormSection";
import getData from "../../../hooks/useApi";
import { ADMIN_INSCHRIJVING_DETAIL } from "../../../types/apiTypes";

interface InschrijvingDetail {
  _id: string;
  datum: string;
  training: string;
  klant: Klant;
  hond: Hond;
  created_at: string;
  updated_at: string;
}

interface Klant {
  _id: string;
  vnaam: string;
  lnaam: string;
}
interface Hond {
  _id: string;
  naam: string;
  ras: string;
}

const initialState: InschrijvingDetail = {
  _id: "",
  datum: "",
  training: "",
  klant: {
    _id: "",
    vnaam: "",
    lnaam: "",
  },
  hond: {
    _id: "",
    naam: "",
    ras: "",
  },
  created_at: "",
  updated_at: "",
};

const InschrijvingDetail = () => {
  const router = useRouter();
  const { slug, editMode } = router.query;

  const [edit, setEdit] = useState<boolean>(editMode ? true : false);
  const [data, setData] = useState<InschrijvingDetail>(initialState);

  useEffect(() => {
    (async () => {
      if (slug) {
        const { data, error } = await getData(ADMIN_INSCHRIJVING_DETAIL + slug);
        if (data) setData(data);
        else if (error) {
          toast.error(error.message);
        }
      }
    })();
  }, [slug]);

  const { control, handleSubmit } = useForm<InschrijvingDetail>();

  return (
    <Dashboard>
      <FormRow className="flex-row-reverse mb-10">
        {edit ? (
          <Button label={"save"} onClick={() => setEdit(false)} />
        ) : (
          <Button label={"edit"} onClick={() => setEdit(true)} />
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
                value={value ?? data.datum ?? "onbekend"}
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
                value={value ?? data.training ?? "onbekend"}
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
                value={value ?? data.created_at ?? "onbekend"}
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
                value={value ?? data.klant?.vnaam ?? "onbekend"}
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
                value={value ?? data.klant?.lnaam ?? "onbekend"}
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
                value={value ?? data.hond?.naam ?? "onbekend"}
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
                value={value ?? data.hond?.ras ?? "onbekend"}
                disabled={true}
              />
            )}
          />
        </FormRow>
      </FormSection>
    </Dashboard>
  );
};

export default InschrijvingDetail;
