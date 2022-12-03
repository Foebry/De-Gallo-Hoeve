import { IsKlantCollection } from "src/types/EntityTpes/KlantTypes";

export type RegisterBodyType = {};

export interface IsRegisterPayload extends IsKlantCollection {
  save: () => Promise<IsKlantCollection>;
}

export interface IsRegisterResponseBody extends IsKlantCollection {}
