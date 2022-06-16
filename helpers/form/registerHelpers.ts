import { RegisterHondInterface } from "../../types/formTypes/registerTypes";
export const newHond = (id: string): RegisterHondInterface => {
    return {
      id,
      naam: "",
      geboortedatum: "",
      ras_id: {options: [{label: "ras", value: undefined}]},
      geslacht: "",
      gecastreerd: "",
      gesteriliseerd: "",
      chipNumber: "",
    };
  };