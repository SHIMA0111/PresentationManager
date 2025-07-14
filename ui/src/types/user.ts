import { Team } from "./team";

export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    teams: Team[]
}