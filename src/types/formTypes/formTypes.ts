import { RegisterHondInterface } from "./registerTypes"

export interface BasicFormInterface {

}

export interface FormInterface extends BasicFormInterface{
    email?: string,
    password?: string,
    lnaam?: string,
    vnaam?: string,
    straat?: string,
    nr?: string,
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
    lnaam: "",
    vnaam: "",
    straat: "",
    nr: "",
    bus: "",
    gemeente: "",
    postcode: "",
    telefoon: "",
    honden: [],
    arts_postcode: "",
    arts_name: "",
    arts_id: ""
}

