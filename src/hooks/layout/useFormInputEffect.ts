import { RefObject, useEffect } from 'react';

interface FormInputEffectProps {
  labelRef: RefObject<HTMLLabelElement>;
  inputRef: RefObject<HTMLInputElement>;
  value: string;
  hasFocus: boolean;
}

const useFormInputEffect = ({
  labelRef,
  inputRef,
  value,
  hasFocus,
}: FormInputEffectProps) => {
  useEffect(() => {
    if (labelRef.current !== null && inputRef.current !== null) {
      if (value > '' || hasFocus) {
        const inputHeight = inputRef.current.offsetHeight;
        labelRef.current.style.bottom = `+${inputHeight.toString()}px`;
        labelRef.current.style.color = '#40909b';
        labelRef.current.style.transition = 'all 0.5s ease';
        inputRef.current.classList.add('inputActive');
      } else {
        labelRef.current.style.bottom = '0px';
        labelRef.current.style.color = '#252525';
        inputRef.current.classList.remove('inputActive');
      }
    }
  }, [value, hasFocus]);
};

export default useFormInputEffect;
