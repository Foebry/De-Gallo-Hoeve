import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Dashboard from "src/components/admin/dashboard";
import Button from "src/components/buttons/Button";
import FormInput from "src/components/form/FormInput";
import FormRow from "src/components/form/FormRow";
import FormSection from "src/components/form/FormSection";
import { MySelect } from "src/components/MySelect";
import { Body } from "src/components/Typography/Typography";
import getData from "src/hooks/useApi";
import { ADMIN_KLANT_DETAIL } from "src/types/apiTypes";
import { ADMINLISTDOGS, ADMINLISTSUBSCRIPTIONS } from "src/types/linkTypes";

interface KlantDetail {
  _id: string;
  email: string;
  vnaam: string;
  lnaam: string;
  gsm: string;
  straat: string;
  nr: string;
  bus?: string;
  gemeente: string;
  postcode: string;
  honden: Hond[];
  roles: string;
  verified: boolean;
  verified_at?: string;
  created_at: string;
  inschrijvingen: Inschrijving[];
}

interface Hond {
  _id: string;
  geslacht: string;
  naam: string;
  ras: string;
}

interface Inschrijving {
  _id: string;
  datum: string;
  hond: string;
  training: string;
}

const initialState: KlantDetail = {
  _id: "",
  email: "",
  vnaam: "",
  lnaam: "",
  gsm: "",
  straat: "",
  nr: "0",
  gemeente: "",
  postcode: "0",
  honden: [],
  roles: "",
  verified: false,
  verified_at: "",
  created_at: "",
  inschrijvingen: [],
};

const KlantDetail = () => {
  const router = useRouter();
  const { slug, editMode } = router.query;

  const [edit, setEdit] = useState<boolean>(editMode ? true : false);
  const [data, setData] = useState<KlantDetail>(initialState);
  const [limitInschrijvingen, setLimitInschrijvingen] = useState<number>(5);

  const onShowMore = () => {
    setLimitInschrijvingen((limitInschrijvingen) => limitInschrijvingen + 5);
  };

  useEffect(() => {
    (async () => {
      if (slug) {
        const { data } = await getData(ADMIN_KLANT_DETAIL + slug);
        setData(data);
      }
    })();
  }, [slug]);

  const { control, handleSubmit } = useForm<KlantDetail>();

  return (
    <>
      <head>
        <title>De Gallo-hoeve - Klantdetail</title>
      </head>
      <Dashboard>
        <FormRow className="flex-row-reverse mb-10">
          {edit ? (
            <Button label={"save"} onClick={() => setEdit(false)} />
          ) : (
            <Button label="edit" onClick={() => setEdit(true)} />
          )}
        </FormRow>
        <FormSection label="Registratie gegevens">
          <FormRow className="items-center">
            <Controller
              name="verified"
              control={control}
              render={({ field: { onChange, value } }) => (
                <MySelect
                  name="verified"
                  onChange={onChange}
                  disabled={true}
                  label="geverifiëerd"
                  options={[
                    { label: "Ja", value: true },
                    { label: "Nee", value: false },
                  ]}
                  value={
                    value ?? {
                      label: data.verified ? "Ja" : "Nee",
                      value: data.verified,
                    }
                  }
                />
              )}
            />
            <Controller
              name="created_at"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormInput
                  id="createdAt"
                  label="geregistreerd op"
                  name="created_at"
                  onChange={onChange}
                  value={value ?? data.created_at ?? "Onbekend"}
                  disabled={true}
                />
              )}
            />
            <Controller
              name="verified_at"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormInput
                  id="verifiedAt"
                  label="geverifiëerd op"
                  name="verified_at"
                  onChange={onChange}
                  value={value ?? data.verified_at ?? "Onbekend"}
                  disabled={true}
                />
              )}
            />
          </FormRow>
        </FormSection>
        <FormSection label="Persoonlijke gegevens">
          <div className="mb-20">
            <FormRow className="mb-10">
              <div className="w-2/5">
                <Controller
                  name="vnaam"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormInput
                      id="vnaam"
                      label="voornaam"
                      name="vnaam"
                      onChange={onChange}
                      value={value ?? data.vnaam}
                      disabled={!edit}
                    />
                  )}
                />
              </div>
              <div className="w-2/5">
                <Controller
                  name="lnaam"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormInput
                      id="lnaam"
                      label="achternaam"
                      name="lnaam"
                      onChange={onChange}
                      value={value ?? data.lnaam}
                      disabled={!edit}
                    />
                  )}
                />
              </div>
            </FormRow>
            <FormRow>
              <div className="w-2/5">
                <Controller
                  name="email"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormInput
                      id="email"
                      label="email"
                      name="email"
                      onChange={onChange}
                      value={value ?? data.email}
                      disabled={!edit}
                    />
                  )}
                />
              </div>
              <div className="w-2/5">
                <FormRow>
                  <div className="w-1/2">
                    <Controller
                      name="gsm"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <FormInput
                          id="gsm"
                          label="gsm-nummer"
                          name="gsm"
                          onChange={onChange}
                          value={value ?? data.gsm}
                          disabled={!edit}
                        />
                      )}
                    />
                  </div>
                </FormRow>
              </div>
            </FormRow>
          </div>
          <div>
            <FormRow className="mb-10">
              <div className="w-2/5">
                <Controller
                  name="straat"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormInput
                      id="straat"
                      label="straat"
                      name="straat"
                      onChange={onChange}
                      value={value ?? data.straat}
                      disabled={!edit}
                    />
                  )}
                />
              </div>
              <div className="w-2/5">
                <FormRow>
                  <Controller
                    name="nr"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <FormInput
                        id="nr"
                        label="Huisnummer"
                        name="nr"
                        onChange={onChange}
                        value={value ?? data.nr}
                        disabled={!edit}
                      />
                    )}
                  />
                  <Controller
                    name="bus"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <FormInput
                        id="bus"
                        label="bus"
                        name="bus"
                        onChange={onChange}
                        value={value ?? data.bus ?? ""}
                        disabled={!edit}
                      />
                    )}
                  />
                </FormRow>
              </div>
            </FormRow>
            <FormRow>
              <div className="w-2/5">
                <Controller
                  name="gemeente"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormInput
                      id="gemeente"
                      label="gemeente"
                      name="gemeent"
                      onChange={onChange}
                      value={value ?? data.gemeente}
                      disabled={!edit}
                    />
                  )}
                />
              </div>
              <div className="w-2/5">
                <FormRow>
                  <div className="1/2">
                    <Controller
                      name="postcode"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <FormInput
                          id="postcode"
                          label="postcode"
                          name="postcode"
                          onChange={onChange}
                          value={value ?? data.postcode}
                          disabled={!edit}
                        />
                      )}
                    />
                  </div>
                </FormRow>
              </div>
            </FormRow>
          </div>
        </FormSection>
        <FormRow>
          <div className="w-5/12">
            <FormSection label="honden" style={{ padding: "p-5" }}>
              {data.honden?.map((hond) => (
                <div key={hond._id} className="flex justify-between">
                  <Link href={ADMINLISTDOGS + hond._id}>{hond.naam}</Link>
                  <Body>{hond.ras}</Body>
                </div>
              ))}
            </FormSection>
          </div>
          <div className="w-5/12">
            <FormSection label="inschrijvingen" style={{ padding: "p-5" }}>
              {data.inschrijvingen
                .slice(0, limitInschrijvingen)
                .map((inschrijving) => (
                  <div key={inschrijving._id} className="flex justify-between">
                    <Link href={ADMINLISTSUBSCRIPTIONS + inschrijving._id}>
                      {inschrijving.datum.split(" ")[0]}
                    </Link>
                    <Body>{inschrijving.datum.split(" ")[1]}</Body>
                    <Body>{inschrijving.training}</Body>
                    <Body>{inschrijving.hond}</Body>
                  </div>
                ))}
              <div className="pt-10 flex justify-center">
                <Button
                  label={
                    limitInschrijvingen >= data.inschrijvingen.length
                      ? "toon minder"
                      : "toon meer"
                  }
                  onClick={
                    limitInschrijvingen >= data.inschrijvingen.length
                      ? () => setLimitInschrijvingen(5)
                      : onShowMore
                  }
                />
              </div>
            </FormSection>
          </div>
        </FormRow>
      </Dashboard>
    </>
  );
};

export default KlantDetail;

export const getStaticSiteProps = () => {
  return { props: {} };
};
