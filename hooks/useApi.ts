import axios from "axios";

const getData = async (endpoint: string) => {
    // const route = "http://localhost:8000/api/"+endpoint;
    const route = "https://www.wdev2.be/fs_sander/eindwerk/api/"+endpoint;
    try{
        const {data} = await axios(route);
        return {data, error: undefined};
    }
    catch(error: any) {
        return {data: [], error};
    }
}

export default getData;