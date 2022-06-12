import { RegisterHondInterface } from "./formTypes/registerTypes"
export interface FormInterface {
    email?: string,
    password?: string,
    name?: string,
    firstName?: string,
    straat?: string,
    nummer?: string,
    bus?: string,
    gemeente?: string,
    postcode?: string,
    telefoon?: string,
    honden?: RegisterHondInterface[],
    arts_postcode: string,
    arts_name: string,
    arts_id: string
}

