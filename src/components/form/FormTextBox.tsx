import React, {
  CSSProperties,
  Dispatch,
  HTMLAttributes,
  ReactElement,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import useFormInputEffect from '../../hooks/layout/useFormInputEffect';
import { ContactErrorInterface } from '../Footer';
import TextAreaAutoSize from 'react-textarea-autosize';
import { FormError } from '../Typography/Typography';

export interface FormTextBoxProps {
  label: string | ReactElement;
  name: string;
  id: string;
  value: string;
  onChange: (e: React.FormEvent<HTMLTextAreaElement>) => void;
  errors: Record<string, string>;
  setErrors: Dispatch<SetStateAction<ContactErrorInterface>>;
  style: CSSProperties;
  required?: boolean;
}

export const FormTextBox: React.FC<FormTextBoxProps> = ({
  label,
  name,
  id,
  value,
  onChange,
  errors,
  setErrors,
  style,
  required = false,
}) => {
  const labelRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasFocus, setHasFocus] = useState<boolean>(false);
  const fieldName = name;

  useFormInputEffect({ labelRef, inputRef, value, hasFocus });

  return (
    <div
      style={{
        marginBottom: style.marginBottom ?? '48px',
        position: style.position ?? 'relative',
      }}
      className={`formInput`}
      ref={inputRef}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
    >
      <label
        className="absolute pl-2.5 bottom-1 text-green-100 mr-5 pointer-events-none flex items-center gap-1 w-full"
        htmlFor={id}
        ref={labelRef}
      >
        {label}
        {required && <span className="text-red-900">*</span>}
      </label>
      <TextAreaAutoSize
        className="block w-full text-xl outline-none border-b-[1px] border-b-grey-500 py-1 px-2.5 text-black-100"
        id={id}
        name={name}
        onChange={(e) => {
          setErrors?.(() => ({ ...errors, [fieldName]: undefined }));
          onChange(e);
        }}
        value={value}
        autoComplete="off"
      ></TextAreaAutoSize>
      <FormError>{errors?.[fieldName]}</FormError>
    </div>
  );
};
