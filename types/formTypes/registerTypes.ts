export interface RegisterPersonalValuesInterface {
    name: string,
    firstName: string,
    email: string,
    straat: string,
    nummer: string,
    bus: string,
    gemeente: string,
    postcode: string,
    telefoon: string,
}

export type geslachtType = "" | "Reu" | "Teef";

export interface RegisterHondValuesInterface {
    name: string,
    dob: string,
    ras: string,
    geslacht: geslachtType,
    chipNumber: string,
    gecastreerd?: boolean | "",
    gesteriliseerd?: boolean | "",
}

export interface dierenartsInterface {
    postcode: string,
    naam?: string,
    id?: string
}

export interface RegisterInterface {
    name: string,
    firstName: string,
    email: string,
    straat: string,
    nummer: string,
    bus: string,
    gemeente: string,
    postcode: string,
    telefoon: string,
    honden: RegisterHondValuesInterface[],
    dierenarts: dierenartsInterface
}

export const registerValues: RegisterInterface = {
    name: "",
    firstName: "",
    email: "",
    straat: "",
    nummer: "",
    bus: "",
    gemeente: "",
    postcode: "",
    telefoon: "",
    honden: [
        {
            name: "",
            dob: "",
            ras: "",
            geslacht: "",
            chipNumber: "",
            gecastreerd: "",
            gesteriliseerd: "",
        }
    ],
    dierenarts: {
        postcode: "",
        naam: "",
        id: ""
    }
}

export interface registerRulesInterface {
    name: {
        required: boolean
    },
    firstName: {
        required: boolean
    },
    email: {
        required: boolean,
        pattern: ""
    },
    straat: {
        required: boolean,
    },
    nummer: {
        required: boolean
    },
    bus: {
        required: boolean
    },
    gemeente: {
        required: boolean
    },
    postcode: {
        required: boolean
    },
    telefoon: {
        required: boolean
    },
    honden: [
        {
            name: {
                required: boolean,
            },
            dob: {
                required: boolean,
                type: string
            },
            ras: {
                required: boolean
            },
            geslacht: {
                required: boolean,
                value: string[]
            },
            chipNumber: {
                required: boolean
            },
            gecastreerd: {
                required: boolean,
                value: Boolean[]
            },
            gesteriliseerd: {
                required: boolean,
                value: Boolean[]
            },
        }
    ],
    dierenarts: {
        postcode: {
            required: boolean
        },
        naam: {
            required: boolean
        },
        id: {
            required: boolean
        }
    }
}

export const registerRules: registerRulesInterface = {
    name: {
        required: true
    },
    firstName: {
        required: true
    },
    email: {
        required: true,
        pattern: ""
    },
    straat: {
        required: true,
    },
    nummer: {
        required: true
    },
    bus: {
        required: true
    },
    gemeente: {
        required: true
    },
    postcode: {
        required: true
    },
    telefoon: {
        required: true
    },
    honden: [
        {
            name: {
                required: true,
            },
            dob: {
                required: true,
                type: "DateTime"
            },
            ras: {
                required: true
            },
            geslacht: {
                required: true,
                value: ["Reu", "Teef"]
            },
            chipNumber: {
                required: true
            },
            gecastreerd: {
                required: false,
                value: [true, false]
            },
            gesteriliseerd: {
                required: false,
                value: [true, false]
            },
        }
    ],
    dierenarts: {
        postcode: {
            required: true
        },
        naam: {
            required: false
        },
        id: {
            required: false
        }
    }

}