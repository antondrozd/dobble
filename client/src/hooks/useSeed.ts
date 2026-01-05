import { MAX_INT32 } from "@dobble/shared/constants";
import { create } from "zustand";

type SeedStore = {
  seed: number;
  setSeed: (seed: number) => void;
  generateSeed: () => void;
};

export const useSeed = create<SeedStore>((set) => ({
  seed: Math.floor(Math.random() * MAX_INT32),
  setSeed: (seed) => set({ seed }),
  generateSeed: () => set({ seed: Math.floor(Math.random() * MAX_INT32) }),
}));
