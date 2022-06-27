import React, { useState } from "react";
import { useRef } from "react";
import useFormInputEffect from "../../hooks/layout/useFormInputEffect";
import { FormError } from "../Typography/Typography";

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
}) => {
  const labelRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasFocus, setHasFocus] = useState(false);
  const fieldName = name;

  useFormInputEffect({ labelRef, inputRef, value, hasFocus });

  return (
    <div
      className={`mb-5 relative ${extra} formInput`}
      ref={inputRef}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
    >
      <label
        className="absolute pl-2.5 bottom-1 text-right text-gray-100 mr-5 capitalize pointer-events-none"
        htmlFor={id}
        ref={labelRef}
      >
        {label}
      </label>
      <input
        className="block w-full text-xl outline-none border-b-[1px] border-b-gray-100 py-1 px-2.5 text-green-100 bg-grey-300"
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
