import { nanoid } from "nanoid";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/appContext";
import { FAILURE, SUCCESS } from "../types/styleTypes";
import { Body } from "./Typography/Typography";

type ModalType = "failure" | "success";

export interface ModalInterface {
  type: ModalType;
  message: string;
}

const Modal: React.FC<ModalInterface> = ({ type, message }) => {
  const { modal, setModal } = useContext(AppContext);
  const [seconds, setSeconds] = useState(10);
  useEffect(() => {
    setTimeout(() => {
      if (seconds > 0) setSeconds((seconds) => seconds - 1);
      else setModal({ ...modal, active: false });
    }, 1000);
  }, [seconds]);
  return (
    <div
      className={
        type === "failure"
          ? "absolute block left-25p right-25p -top-7 px-5 py-2 bg-red-600 text-red-900 rounded border-solid border border-red-800 text-center"
          : "absolute block left-25p right-25p -top-7 px-5 py-2 bg-green-300 text-green-100 rounded border-solid border border-green-500 text-center"
      }
    >
      <Body>{message}</Body>
    </div>
  );
};

export default Modal;
