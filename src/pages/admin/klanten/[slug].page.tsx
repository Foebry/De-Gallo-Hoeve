import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KlantDto } from 'src/common/api/types/klant';
import Dashboard from 'src/components/admin/dashboard';
import Button from 'src/components/buttons/Button';
import FormInput from 'src/components/form/FormInput';
import FormRow from 'src/components/form/FormRow';
import FormSection from 'src/components/form/FormSection';
import Spinner from 'src/components/loaders/Spinner';
import { MySelect } from 'src/components/MySelect';
import { Body } from 'src/components/Typography/Typography';
import { useKlantContext } from 'src/context/app/klantContext';
import { ADMINLISTDOGS, ADMINLISTSUBSCRIPTIONS } from 'src/types/linkTypes';

const KlantDetail = () => {
  const router = useRouter();

  const { useGetKlantDetail } = useKlantContext();
  const { data, isLoading } = useGetKlantDetail(
    undefined,
    `/api/admin/klanten/${router.query.slug}`
  );

  const [limitInschrijvingen, setLimitInschrijvingen] = useState<number>(5);
  const [edit, setEdit] = useState<boolean>(router.query.editMode ? true : false);

  const onShowMore = () => {
    setLimitInschrijvingen((limitInschrijvingen) => limitInschrijvingen + 5);
  };

  const { control, handleSubmit } = useForm<KlantDto>();

  return (
    <>
      <Head>
        <title>De Gallo-hoeve - Klantdetail</title>
      </Head>
      <Dashboard>
        {isLoading && <Spinner />}
        {!isLoading && data && data !== null && (
          <>
            {' '}
            <FormRow className="flex-row-reverse mb-10">
              {edit ? (
                <Button label={'save'} onClick={() => setEdit(false)} />
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
                        { label: 'Ja', value: true },
                        { label: 'Nee', value: false },
                      ]}
                      value={
                        value ?? {
                          label: data.verified ? 'Ja' : 'Nee',
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
                      value={value ?? data.created_at ?? 'Onbekend'}
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
                      value={value ?? data.verified_at ?? 'Onbekend'}
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
                            value={value ?? data.bus ?? ''}
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
                <FormSection label="honden" style={{ padding: 'p-5' }}>
                  {data.honden?.map((hond) => (
                    <div key={hond.id} className="flex justify-between">
                      <Link href={ADMINLISTDOGS + hond.id}>{hond.naam}</Link>
                      <Body>{hond.ras}</Body>
                    </div>
                  ))}
                </FormSection>
              </div>
              <div className="w-5/12">
                <FormSection label="inschrijvingen" style={{ padding: 'p-5' }}>
                  {data.inschrijvingen
                    .slice(0, limitInschrijvingen)
                    .map((inschrijving) => (
                      <div key={inschrijving.id} className="flex justify-between">
                        <Link href={ADMINLISTSUBSCRIPTIONS + inschrijving.id}>
                          {inschrijving.datum.split(' ')[0]}
                        </Link>
                        <Body>{inschrijving.datum.split(' ')[1]}</Body>
                        <Body>{inschrijving.training}</Body>
                        <Body>{inschrijving.hond}</Body>
                      </div>
                    ))}
                  <div className="pt-10 flex justify-center">
                    <Button
                      label={
                        limitInschrijvingen >= data.inschrijvingen.length
                          ? 'toon minder'
                          : 'toon meer'
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
          </>
        )}
      </Dashboard>
    </>
  );
};

export default KlantDetail;

export const getStaticSiteProps = () => {
  return { props: {} };
};
