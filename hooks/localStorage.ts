import { useEffect, useState } from "react";

const getFromLocalStorage = (key: string) => {
    const [value, setValue] = useState<any>();

    useEffect(() => setValue( localStorage.getItem(key) ), [key]);

    return value;
}

export default getFromLocalStorage;