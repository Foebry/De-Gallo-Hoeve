import { useEffect, useState, useContext } from "react";


const getFromLocalStorage = (key: string) => {
    const [value, setValue] = useState<any>();

    useEffect(() => setValue( localStorage.getItem(key) ), [key]);

    return value;
}

export const initializeLocalStorage = (data: any) => {
    localStorage.setItem("naam", data.naam);
    localStorage.setItem("id", data.id);
}

export default getFromLocalStorage;