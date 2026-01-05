import { create } from "zustand";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";

const generateName = () =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: " ",
    style: "capital",
  });

type PlayerNameStore = {
  name: string;
  setName: (name: string) => void;
  regenerateName: () => void;
};

export const usePlayerName = create<PlayerNameStore>((set) => ({
  name: generateName(),
  setName: (name) => set({ name }),
  regenerateName: () => set({ name: generateName() }),
}));
