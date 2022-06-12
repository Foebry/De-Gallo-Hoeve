import { RegisterHondInterface } from "./registerTypes"

export interface BasicFormInterface {

}

export interface FormInterface extends BasicFormInterface{
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

export const FormValues: FormInterface = {
    email: "",
    password: "",
    name: "",
    firstName: "",
    straat: "",
    nummer: "",
    bus: "",
    gemeente: "",
    postcode: "",
    telefoon: "",
    honden: [],
    arts_postcode: "",
    arts_name: "",
    arts_id: ""
}

