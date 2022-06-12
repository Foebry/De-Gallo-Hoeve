import { RegisterHondInterface } from "../../types/formTypes/registerTypes";
export const newHond = (id: string): RegisterHondInterface => {
    return {
      id,
      name: "",
      dob: "",
      ras: "",
      geslacht: "",
      gecastreerd: "",
      gesteriliseerd: "",
      chipNumber: "",
    };
  };