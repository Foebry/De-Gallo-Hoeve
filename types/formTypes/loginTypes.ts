export interface LoginInterface {
    email: string,
    password: string
}

export const loginValues: LoginInterface = {
    email: "",
    password: "",
}

export interface LoginRulesInterface {
    email: {
        required: boolean,
        pattern: string
    },
    password: {
        required: boolean,
        minLength: Number
    }
}
export const loginRules: LoginRulesInterface = {
    email: {
        required: true,
        pattern: ""
    },
    password: {
        required: true,
        minLength: 8
    }
}