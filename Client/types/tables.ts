import { geslachtType } from "./formTypes/registerTypes"

type HondSoort = "klein" | "middlegroot" | "groot"

export interface Boeking{
    id: Number,
    klant_id: Number,
    start: Date,
    eind: Date,
    referentie: string
}

export interface BoekingDetail{
    id: Number,
    kennel_id: Number,
    boeking_id: Number,
    hond_id: Number,
    loops?: Date,
    ontsnapping: boolean,
    sociaal: boolean,
    medicatie: boolean,
    extra?: string
}

export interface Confirm{
    id: Number,
    klant_id: Number,
    code: string,
    created_at: Date
}

export interface Content{
    id: Number,
    subtitle: string,
    content: string,
    default_content: string,
    image?: string
}

export interface Hond{
    id: Number,
    ras_id: Number,
    klant_id: Number,
    naam: string,
    gebooretedatum: Date,
    chip_nr: string,
    geslacht: geslachtType
}

export interface Image{
    id: Number,
    source: string,
    alt?: string;
}

export interface Inschrijving{
    id: Number,
    hond_id: Number,
    training_id: Number,
    klant_id: Number,
    datum: Date
}

export interface Kennel{
    id: Number,
    omschrijving: string,
    prijs: Number
}

export interface Klant{
    id: Number,
    email: string,
    roles: string,
    password: string,
    vnaam: string,
    lnaam: string,
    gsm: string,
    straat: string,
    nr: Number,
    gemeente: string,
    postcode: Number,
    verified: boolean,
    joined_at: Date,
    verified_at: Date
}

export interface Ras{
    id: Number,
    naam: string,
    soort: HondSoort,
    avatar: string
}

export interface Training{
    id: Number,
    naam: string,
    omschrijving: string,
    prijs: Number
}