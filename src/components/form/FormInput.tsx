import React, { useState } from 'react';
import { useRef } from 'react';
import useFormInputEffect from '../../hooks/layout/useFormInputEffect';
import { FormError } from '../Typography/Typography';

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
  disabled?: boolean;
  onFocus?: (e: React.FormEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  errors,
  extra = '',
  dataid = '',
  setErrors,
  disabled = false,
  onFocus,
}) => {
  const labelRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasFocus, setHasFocus] = useState(false);
  const fieldName = name;

  useFormInputEffect({ labelRef, inputRef, value, hasFocus });

  return (
    <div
      className={`mb-12 relative ${extra} formInput`}
      ref={inputRef}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
    >
      <label
        className={`absolute pl-2.5 bottom-1 mr-5 capitalize pointer-events-none flex items-center gap-1 w-full ${
          disabled ? 'disabled text-black-100' : 'text-green-100'
        }`}
        htmlFor={id}
        ref={labelRef}
      >
        {label}
      </label>
      <input
        className={`block w-full text-xl outline-none border-b-[1px] py-1 px-2.5 text-black-100 ${
          disabled ? 'bg-grey-100 rounded' : undefined
        }`}
        disabled={disabled}
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
        onFocus={onFocus}
      />
      <FormError>{errors?.[fieldName]}</FormError>
    </div>
  );
};

export default FormInput;
