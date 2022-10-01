import { ContentStates } from "../pages/admin/edit";
import {
  CONTENTPRIVETRAINING,
  CONTENTINTRO,
  CONTENTDIENSTEN,
} from "../types/apiTypes";
import getData from "./useApi";

export const useGetContent = async (
  setContent: React.Dispatch<React.SetStateAction<ContentStates>>
) => {
  const { data: intro } = await getData(CONTENTINTRO);
  const { data: diensten } = await getData(CONTENTDIENSTEN);
  const { data: trainingen } = await getData(CONTENTPRIVETRAINING);

  setContent({ intro, diensten, trainingen });
};
