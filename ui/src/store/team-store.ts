import { Team } from "@/types/team";
import { create } from "zustand";

interface TeamState {
    team: Team | null,
    setTeam:  (team: Team) => void
}

export const useTeamStore = create<TeamState>((set) => ({
    team: null,
    setTeam: (team) => set({ team }),
}));