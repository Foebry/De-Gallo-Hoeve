import {
  Title1,
  Title2,
  Title3,
  FootNote,
  Body,
} from "./Typography/Typography";
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoMdMail,
  IoMdPhonePortrait,
} from "react-icons/io";
import Form from "./form/Form";
import FormInput from "./form/FormInput";
import { Controller, useForm } from "react-hook-form";

const Footer = () => {
  const { control, handleSubmit } = useForm();

  return (
    <footer className="mx-auto relative">
      <div className="max-w-7xl mx-auto mb-20">
        <Title1 className="text-green-200">Contacteer ons</Title1>
        <div className="flex gap-10 justify-evenly px-5">
          <div>
            <Body className="flex gap-2 items-center">
              <IoMdPhonePortrait className="text-green-200 text-2xl" />
              Telephone
            </Body>
            <Body className="flex gap-2 items-center">
              <IoMdMail className="text-green-200 text-2xl" />
              E-mail
            </Body>
            <Body className="flex gap-2 items-center">
              <IoLogoFacebook className="text-green-200 text-2xl" />
              Facebook
            </Body>
            <Body className="flex gap-2 items-center">
              <IoLogoInstagram className="text-green-200 text-2xl" />
              Instagram
            </Body>
          </div>
          <div className="border-2 rounded">
            <Form onSubmit={() => {}} action="verzend">
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
                  />
                )}
              />
              <Controller
                name="telefoon"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormInput
                    label="telefoon"
                    name="telefoon"
                    id="telefoon"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <Controller
                name="bericht"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormInput
                    label="bericht"
                    name="bericht"
                    id="bericht"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </Form>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-16 px-76 border-2 z-20">
        <Body>&copy; Copyright 2022. All rights reserved.</Body>
      </div>
    </footer>
  );
};

export default Footer;
