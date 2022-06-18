import axios from "axios";

const useMutation = () => {

    const executerFunc = async(endpoint: string, payload: any) => {
        const environment = process.env.NODE_ENV;
        const api = environment === "production" ? process.env.NEXT_PUBLIC_PROD_API : process.env.NEXT_PUBLIC_DEV_API;

        const route = `${api+endpoint}`
        try {
            const {data} = await axios(route, {
                method: "POST",
                data: payload,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                }
            });
            return {data, error: undefined};
        }
        catch(error) {
            return {undefined, error}
        }
    }
    return executerFunc;
}

export const structureHondenPayload = (payload: any) => {
    console.log(payload);
    const honden = payload?.honden ?? [];
    const new_honden = honden.map((hond:any) => {
        const ras_id = hond.ras_id?.value;
        const geslacht = hond.geslacht?.value;
        return {...hond, ras_id, geslacht};
    });
    return { ...payload, honden: new_honden }
}

export default useMutation;