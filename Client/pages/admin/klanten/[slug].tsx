import { Attachment } from "@sendgrid/helpers/classes";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Dashboard from "../../../components/admin/dashboard";
import Button from "../../../components/buttons/Button";
import FormInput from "../../../components/form/FormInput";
import FormRow from "../../../components/form/FormRow";
import FormSection, {
  StyleOptions,
} from "../../../components/form/FormSection";
import {
  Body,
  Title2,
  Title3,
} from "../../../components/Typography/Typography";
import getData from "../../../hooks/useApi";
import { ADMIN_KLANT_DETAIL } from "../../../types/apiTypes";
import { HondCollection } from "../../../types/EntityTpes/HondTypes";
import { ADMINLISTDOGS } from "../../../types/linkTypes";

interface KlantDetail {
  _id: string;
  email: string;
  vnaam: string;
  lnaam: string;
  gsm: string;
  straat: string;
  nr: number;
  bus?: string;
  gemeente: string;
  postcode: number;
  honden: Hond[];
  roles: string;
  verified: boolean;
  verifiedAt?: string;
  createdAt: string;
  inschrijvingen: number;
}

interface Hond {
  _id: string;
  geslacht: string;
  naam: string;
  ras: string;
}

const KlantDetail = () => {
  const router = useRouter();
  const { slug, editMode } = router.query;

  const [edit, setEdit] = useState<boolean>(editMode ? true : false);
  const [data, setData] = useState<KlantDetail>({
    _id: "",
    email: "",
    vnaam: "",
    lnaam: "",
    gsm: "",
    straat: "",
    nr: 0,
    gemeente: "",
    postcode: 0,
    honden: [{ _id: "", geslacht: "", naam: "", ras: "" }],
    roles: "",
    verified: false,
    verifiedAt: "",
    createdAt: "",
    inschrijvingen: 0,
  });

  useEffect(() => {
    (async () => {
      if (slug) {
        const { data } = await getData(ADMIN_KLANT_DETAIL + slug);
        setData(data);
      }
    })();
  }, [slug]);

  const onChange = () => {};

  const formSectionStyle: StyleOptions = {
    padding: "pt-20 px-10",
    rounding: "rounded-lg",
    borderColor: "border-gray-500",
    margin: "mb-10",
  };

  return (
    <Dashboard>
      <FormRow className="flex-row-reverse mb-10">
        {edit ? (
          <Button label={"save"} onClick={() => setEdit(false)} />
        ) : (
          <Button label="edit" onClick={() => setEdit(true)} />
        )}
      </FormRow>
      <FormSection label="Registratie gegevens">
        <FormRow>
          <FormInput
            id="verified"
            label="geverifiëerd"
            name="verified"
            onChange={onChange}
            value={data.verified ? "Ja" : "Nee"}
          />
          <FormInput
            id="createdAt"
            label="geregistreerd op"
            name="created_at"
            onChange={onChange}
            value={data.createdAt ?? "Onbekend"}
          />
          <FormInput
            id="verifiedAt"
            label="geverifiëerd op"
            name="verified_at"
            onChange={onChange}
            value={data.verifiedAt ?? "Not verified"}
          />
        </FormRow>
      </FormSection>
      <FormSection label="Persoonlijke gegevens">
        <div className="mb-20">
          <FormRow className="mb-10">
            <div className="w-2/5">
              <FormInput
                id="vnaam"
                label="voornaam"
                name="vnaam"
                onChange={onChange}
                value={data.vnaam}
              />
            </div>
            <div className="w-2/5">
              <FormInput
                id="lnaam"
                label="achternaam"
                name="lnaam"
                onChange={onChange}
                value={data.lnaam}
              />
            </div>
          </FormRow>
          <FormRow>
            <div className="w-2/5">
              <FormInput
                id="email"
                label="email"
                name="email"
                onChange={onChange}
                value={data.email}
              />
            </div>
            <div className="w-2/5">
              <FormRow>
                <div className="w-1/2">
                  <FormInput
                    id="gsm"
                    label="gsm-nummer"
                    name="gsm"
                    onChange={onChange}
                    value={data.gsm}
                  />
                </div>
              </FormRow>
            </div>
          </FormRow>
        </div>
        <div>
          <FormRow className="mb-10">
            <div className="w-2/5">
              <FormInput
                id="straat"
                label="straat"
                name="straat"
                onChange={onChange}
                value={data.straat}
              />
            </div>
            <div className="w-2/5">
              <FormRow>
                <FormInput
                  id="nr"
                  label="Huisnummer"
                  name="nr"
                  onChange={onChange}
                  value={data.nr.toString()}
                />
                <FormInput
                  id="bus"
                  label="bus"
                  name="bus"
                  onChange={onChange}
                  value={data.bus ?? ""}
                />
              </FormRow>
            </div>
          </FormRow>
          <FormRow>
            <div className="w-2/5">
              <FormInput
                id="gemeente"
                label="gemeente"
                name="gemeent"
                onChange={onChange}
                value={data.gemeente}
              />
            </div>
            <div className="w-2/5">
              <FormRow>
                <div className="1/2">
                  <FormInput
                    id="postcode"
                    label="postcode"
                    name="postcode"
                    onChange={onChange}
                    value={data.postcode.toString()}
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
            {data.honden.map((hond) => (
              <div key={hond._id} className="flex justify-between">
                <Link href={ADMINLISTDOGS + hond._id}>{hond.naam}</Link>
                <Body>{hond.ras}</Body>
              </div>
            ))}
          </FormSection>
        </div>
        <div className="w-5/12">
          <FormSection label="inschrijvingen" style={{ padding: "p-5" }}>
            {data.inschrijvingen}
          </FormSection>
        </div>
      </FormRow>
    </Dashboard>
  );
};

export default KlantDetail;
