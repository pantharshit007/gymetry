import { create } from "zustand";

interface collapseState {
  collapse: boolean;
  toggle: () => void;
  set: (value: boolean) => void;
}

export const useCollapseState = create<collapseState>((set) => ({
  collapse: false,
  toggle: () => set((state) => ({ collapse: !state.collapse })),
  set: (value: boolean) => set({ collapse: value }),
}));
