import axios from "axios";

const getData = async (endpoint: string, options: any={}) => {
    const environment = process.env.NODE_ENV;
    const api = environment === "production" ? process.env.NEXT_PUBLIC_PROD_API : process.env.NEXT_PUBLIC_DEV_API;

    if( endpoint.includes("klantId") ) {
        const klantId = options.klantId ?? localStorage.getItem("id");
        endpoint = endpoint.replace(":klantId", klantId);
    }
    const route = `${api+endpoint}`
    try{
        const {data} = await axios(route, {
            withCredentials: true
        });
        return {data, error: undefined};
    }
    catch(error: any) {
        console.log(error);
        return {data: [], error};
    }
}

export default getData;