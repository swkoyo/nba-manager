import { Roster } from "@/lib/types"

export type DetailedRoster = Roster & {
    teamName: string;
    teamCity: string;
    teamState: string;
    playoffRoundName: string | null;
    playerID: number;
    playerFirstName: string;
    playerLastName: string;
}
