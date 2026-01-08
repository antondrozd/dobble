import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
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

type PlayerStore = {
  id: string | null;
  name: string;
  setId: (id: string | null) => void;
  setName: (name: string) => void;
  regenerateName: () => void;
};

export const usePlayer = create<PlayerStore>()(
  persist(
    (set) => ({
      id: null,
      name: generateName(),
      setId: (id) => set({ id }),
      setName: (name) => set({ name }),
      regenerateName: () => set({ name: generateName() }),
    }),
    { name: "player", storage: createJSONStorage(() => sessionStorage) }
  )
);
