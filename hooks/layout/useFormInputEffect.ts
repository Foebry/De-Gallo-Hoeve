import { RefObject, useEffect } from "react";

interface FormInputEffectProps {
    labelRef: RefObject<HTMLLabelElement>,
    inputRef: RefObject<HTMLInputElement>,
    value: string,
    hasFocus: boolean
}

const useFormInputEffect = ({labelRef, inputRef, value, hasFocus}: FormInputEffectProps) => {
  useEffect(() => {
    if (labelRef.current !== null && inputRef.current !== null) {
      if (value !== "" || hasFocus) {
        const labelWidth = labelRef.current.offsetWidth + 10;
        labelRef.current.style.left = `-${labelWidth.toString()}px`;
        labelRef.current.style.color = "#40909b";
        labelRef.current.style.transition = "all 0.5s ease";
        inputRef.current.classList.add("inputActive");
      } else {
        labelRef.current.style.left = "0px";
        labelRef.current.style.color = "#efefef";
        inputRef.current.classList.remove("inputActive");
      }
    }
  }, [value, hasFocus]);
};

export default useFormInputEffect;
