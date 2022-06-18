import axios from "axios";

const getData = async (endpoint: string) => {
    const environment = process.env.NODE_ENV;
    const api = environment === "production" ? process.env.NEXT_PUBLIC_PROD_API : process.env.NEXT_PUBLIC_DEV_API;

    const route = `${api+endpoint}`
    try{
        const {data} = await axios(route);
        return {data, error: undefined};
    }
    catch(error: any) {
        return {data: [], error};
    }
}

export default getData;