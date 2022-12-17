import { IsKlantCollection } from "@/types/EntityTpes/KlantTypes";

export const mapToNewKlantResponse = (newKlant: IsKlantCollection) => ({
  ...newKlant,
  _id: newKlant._id.toString(),
  created_at: newKlant.created_at.toISOString(),
  updated_at: newKlant.updated_at.toISOString(),
  honden: newKlant.honden.map((hond) => ({
    created_at: hond.created_at.toISOString(),
    geboortdatum: hond.geboortedatum.toISOString(),
    updated_at: hond.updated_at.toISOString(),
    _id: hond._id.toString(),
  })),
});
