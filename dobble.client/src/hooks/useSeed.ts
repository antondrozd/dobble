import { MAX_INT32 } from "@dobble/shared";
import { create } from "zustand";

interface ISeedStore {
  seed: number;
  setSeed: (seed: number) => void;
  generateSeed: () => void;
}

export const useSeed = create<ISeedStore>((set) => ({
  seed: Math.floor(Math.random() * MAX_INT32),
  setSeed: (seed) => set({ seed }),
  generateSeed: () => set({ seed: Math.floor(Math.random() * MAX_INT32) }),
}));
