import axios from "axios";

const useMutation = () => {

    const executerFunc = async(endpoint: string, payload: any) => {
        const route = "http://localhost:8000/api"+endpoint;
        try {
            const {data} = await axios(route, {
                method: "POST",
                data: payload
            });
            return {data, error: undefined};
        }
        catch(error) {
            return {data: undefined, error}
        }
    }
    return executerFunc;
}

export const structureHondenPayload = (payload: any) => {
    const honden = payload?.honden ?? [];
    const new_honden = honden.map((hond:any) => {
        const ras_id = hond.ras_id.value;
        return {...hond, ras_id};
    });
    return { ...payload, honden: new_honden }
}

export default useMutation;