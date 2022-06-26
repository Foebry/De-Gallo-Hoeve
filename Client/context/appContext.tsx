import { createContext, useContext } from "react";
import { ModalInterface } from "../components/Modal";

export type AppContent = {
  modal: ModalContextInterface;
  setModal: (modal: ModalContextInterface) => void;
};
export interface ModalContextInterface extends ModalInterface {
  active: boolean;
}

export const AppContext = createContext<AppContent>({
  modal: {
    message: "",
    type: "success",
    active: false,
  },
  setModal: () => {},
});

export const useAppContext = () => useContext(AppContext);
