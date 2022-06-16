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
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
  error?: string;
  dataid?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  extra,
  dataid = "",
}) => {
  const labelRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasFocus, setHasFocus] = useState(false);

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
        onChange={onChange}
        value={value}
        autoComplete="off"
        data-id={`${dataid}`}
      />
      <FormError>{error}</FormError>
    </div>
  );
};

export default FormInput;
