import { ADMIN_HOND_DETAIL, RASSEN } from "@/types/apiTypes";
import Dashboard from "@components/admin/dashboard";
import Button from "@components/buttons/Button";
import { geslachten } from "@components/Cards/HondCard";
import FormInput from "@components/form/FormInput";
import FormRow from "@components/form/FormRow";
import { MySelect } from "@components/MySelect";
import { Option } from "@middleware/MongoDb";
import getData from "hooks/useApi";
import moment from "moment";
import { useRouter } from "next/router";
import { HondDetailResponse } from "pages/api/admin/honden/[slug]";
import React, { useState } from "react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

const initialState: HondDetailResponse = {
  _id: "",
  naam: "",
  ras: {
    naam: "",
    _id: "",
  },
  geboortedatum: "",
  geslacht: "",
  eigenaar: {
    fullName: "",
    _id: "",
  },
};

const HondDetail = () => {
  const router = useRouter();
  const { slug, editMode } = router.query;

  const [edit, setEdit] = useState<boolean>(editMode ? true : false);
  const [data, setData] = useState<HondDetailResponse>(initialState);
  const [rassen, setRassen] = useState<Option[]>([]);

  useEffect(() => {
    (async () => {
      if (slug) {
        const { data } = await getData(ADMIN_HOND_DETAIL + slug);
        const { data: rassen } = await getData(RASSEN);
        setData(data);
        setRassen(rassen);
      }
    })();
  }, [slug]);

  const { control, handleSubmit } = useForm<HondDetailResponse>();

  return (
    <>
      <head>
        <title>De Gallo-hoeve - Honddetail</title>
      </head>
      <Dashboard>
        <FormRow className="flex-row-reverse mb-10">
          {edit ? (
            <Button label={"save"} onClick={() => setEdit(false)} />
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
                value={value ?? data.naam}
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
                value={
                  value ??
                  rassen?.find((rasOption) => rasOption.value === data.ras._id)
                }
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
                value={
                  value ??
                  geslachten.find(
                    (geslacht) => geslacht.label === data.geslacht
                  )
                }
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
                value={moment(value ?? data.geboortedatum).format("DD/MM/YYYY")}
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
                value={value ?? data.eigenaar.fullName}
                disabled={true}
              />
            )}
          />
        </FormRow>
      </Dashboard>
    </>
  );
};

export default HondDetail;
