import axios from "axios";

const useApi = async (endpoint: string) => {
    const route = "http://localhost:8000/api"+endpoint;
    try{
        const {data} = await axios(route);
        return {data, error: undefined};
    }
    catch(error: any) {
        return {data: [], error};
    }
}

export default useApi;