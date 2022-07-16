import axios from "axios";

const getData = async (endpoint: string, options: any={}) => {

    if( endpoint.includes("klantId") ) {
        const klantId = options.klantId ?? localStorage.getItem("id");
        endpoint = endpoint.replace(":klantId", klantId);
    }
    try{
        const {data} = await axios(endpoint, {
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