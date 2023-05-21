import { Body, Title2 } from './Typography/Typography';
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoMdMail,
  IoMdPhonePortrait,
} from 'react-icons/io';
import Form from './form/Form';
import FormInput from './form/FormInput';
import { Controller, useForm } from 'react-hook-form';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useMemo, useState } from 'react';
import useMutation from '../hooks/useMutation';
import { CONTACTAPI } from '../types/apiTypes';
import { FormTextBox } from './form/FormTextBox';

interface Props {}

export interface ContactErrorInterface {
  naam?: string;
  email?: string;
  gsm?: string;
  bericht?: string;
}

const Footer: React.FC<Props> = ({}) => {
  const { control, handleSubmit, reset: clearForm } = useForm();
  const emptyState = useMemo(() => ({ naam: '', email: '', gsm: '', bericht: '' }), []);

  const [disabled, setDisabled] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Partial<ContactErrorInterface>>({});

  const contact = useMutation<ContactErrorInterface>(CONTACTAPI);

  const onSubmit = async (values: any) => {
    const payload = values;
    if (!disabled) {
      setDisabled(() => true);
      const { data, error } = await contact({
        ...payload,
        email: payload.email?.trim().toLowerCase(),
        csrf: 'MmJiM2pwNHQ1dg==$c0tKJd-G-aePggUzDLC6H28lsl2iNCjnGBQ5i0vpzdw',
      });
      if (data) {
        toast.success('Bericht ontvangen!');
        clearForm(emptyState);
      }
      if (error) {
        toast.error(error.message);
        setFormErrors(() => error);
      }
      setDisabled(() => false);
    }
  };

  return (
    <footer className="mx-auto relative">
      <div className="px-5 mx-auto  max-w-7xl mb-20 md:px-0">
        <Title2 className="text-green-200">Contacteer ons</Title2>
        <div className="flex flex-wrap-reverse gap-10 justify-evenly">
          <div>
            <Body className="flex gap-2 items-center">
              <IoMdPhonePortrait className="text-green-200 text-2xl" />
              <a href="tel:+32456552678">+32 470 47 16 60</a>
            </Body>
            <Body className="flex gap-2 items-center">
              <IoMdMail className="text-green-200 text-2xl" />
              <Link href="mailto:info@degallohoeve.be">info@degallohoeve.be</Link>
            </Body>
            <Body className="flex gap-2 items-center">
              <IoLogoInstagram className="text-green-200 text-2xl" />
              <a
                href="https://www.instagram.com/degallohoeve"
                target="_blank"
                rel="noreferrer"
              >
                degallohoeve
              </a>
            </Body>
          </div>
          <div className="border-2 rounded">
            <Form onSubmit={handleSubmit(onSubmit)} action="verzend">
              <div className="4xs:px-10 py-10 md:min-w-s">
                <Controller
                  name="naam"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FormInput
                      label="Naam"
                      name="naam"
                      id="naam"
                      value={value}
                      onChange={onChange}
                      errors={formErrors}
                      setErrors={setFormErrors}
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FormInput
                      label="email"
                      name="email"
                      id="email"
                      value={value}
                      onChange={onChange}
                      errors={formErrors}
                      setErrors={setFormErrors}
                    />
                  )}
                />
                <Controller
                  name="gsm"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FormInput
                      label="gsm"
                      name="gsm"
                      id="gsm"
                      value={value}
                      onChange={onChange}
                      errors={formErrors}
                      setErrors={setFormErrors}
                    />
                  )}
                />
                <Controller
                  name="bericht"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FormTextBox
                      style={{}}
                      label="Bericht"
                      name="bericht"
                      id="bericht"
                      value={value}
                      onChange={onChange}
                      errors={formErrors}
                      setErrors={setFormErrors}
                    />
                  )}
                />
              </div>
            </Form>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-16 border-2 z-20">
        <Body className="text-center">&copy; Copyright 2023. All rights reserved.</Body>
      </div>
    </footer>
  );
};

export default Footer;
