import React, { FormEventHandler, useMemo, useState } from "react";
import { useRef } from "react";
import useFormInputEffect from "../../hooks/layout/useFormInputEffect";
import { Body, FormError } from "../Typography/Typography";
import { BsInfoCircle } from "react-icons/bs";

export interface FormInputProps {
  label: string;
  name: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  extra?: string;
  onChange: any;
  onBlur?: (e: any) => void;
  errors?: any;
  dataid?: string;
  setErrors?: any;
  onClick?: (e: React.FormEvent<HTMLInputElement>) => void;
  info?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  errors,
  extra = "",
  dataid = "",
  setErrors,
  info,
}) => {
  const labelRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasFocus, setHasFocus] = useState(false);
  const [infoShown, setInfoShown] = useState(false);
  const fieldName = name;
  const infoColor = useMemo(() => {
    return inputRef.current !== null ? "" : "";
  }, [inputRef.current]);

  useFormInputEffect({ labelRef, inputRef, value, hasFocus });

  const handleShowInputInfo = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.preventDefault();
    setInfoShown(!infoShown);
  };

  return (
    <div
      className={`mb-12 relative ${extra} formInput`}
      ref={inputRef}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
    >
      <label
        className="absolute pl-2.5 bottom-1 text-green-100 mr-5 capitalize pointer-events-none flex items-center gap-1 w-full"
        htmlFor={id}
        ref={labelRef}
      >
        {label}
        {info && (
          <div className="relative text-xs">
            <BsInfoCircle
              className="pointer-events-auto cursor-pointer"
              onClick={handleShowInputInfo}
            />
          </div>
        )}
      </label>
      {infoShown && (
        <div className="absolute border-2 rounded px-1 -bottom-6 right-0 text-xs">
          {info}
        </div>
      )}
      <input
        className="block w-full text-xl outline-none border-b-[1px] border-b-grey-500 py-1 px-2.5 text-black-100"
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        onChange={(e) => {
          setErrors?.(() => ({ ...errors, [fieldName]: undefined }));
          onChange(e);
        }}
        value={value}
        autoComplete="off"
        data-id={`${dataid}`}
      />
      <FormError>{errors?.[fieldName]}</FormError>
    </div>
  );
};

export default FormInput;
