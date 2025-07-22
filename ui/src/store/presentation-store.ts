import { Presentation } from "@/types/presentation";
import { create } from "zustand";

interface PresentationsStore {
  presentations: Presentation[];
  setPresentations: (presentations: Presentation[]) => void;
  replacePresentation: (presentation: Presentation) => void;
  removePresentation: (id: string) => void;
}

export const usePresentationsStore = create<PresentationsStore>((set) => ({
  presentations: [],
  setPresentations: (presentations) => set({ presentations }),
  replacePresentation: (presentation) =>
    set((state) => ({
      presentations: state.presentations.map((p) =>
        p.id === presentation.id ? presentation : p,
      ),
    })),
  removePresentation: (id) =>
    set((state) => ({
      presentations: state.presentations.filter((p) => p.id !== id),
    })),
}));
