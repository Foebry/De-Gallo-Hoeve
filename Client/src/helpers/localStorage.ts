import { useEffect, useState } from "react";

const useGetFromLocalStorage = (key: string) => {
  const [value, setValue] = useState<any>();

  useEffect(() => setValue(localStorage.getItem(key)), [key]);

  return value;
};

export const initializeLocalStorage = (data: any) => {
  localStorage.setItem("naam", data.naam);
  localStorage.setItem("id", data.id);
};

export default useGetFromLocalStorage;
