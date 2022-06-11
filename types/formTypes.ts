import { RegisterHondValuesInterface, dierenartsInterface } from "./formTypes/registerTypes"

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
    honden?: RegisterHondValuesInterface[],
    dierenarts?: dierenartsInterface
}

