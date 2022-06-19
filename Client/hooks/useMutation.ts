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
            });
            return {data, error: undefined};
        }
        catch(error) {
            return {data:undefined, error}
        }
    }
    return executerFunc;
}

export const structureHondenPayload = (payload: any) => {
    const honden = payload?.honden ?? [];
    const new_honden = honden.map((hond:any) => {
        const ras_id = hond.ras_id?.value;
        const geslacht = hond.geslacht?.value;
        return {...hond, ras_id, geslacht};
    });
    return { ...payload, honden: new_honden }
}

export const structureDetailsPayload = (payload: any) => {
    const details = payload?.details ?? [];
    const newDetails = details.map((detail:any) => {
        const medicatie = detail.medicatie.value;
        const ontsnapping = detail.ontsnapping.value;
        const sociaal = detail.sociaal.value;
        return {...detail, medicatie, ontsnapping, sociaal};
    })
    return {...payload, details: newDetails};
}

export default useMutation;