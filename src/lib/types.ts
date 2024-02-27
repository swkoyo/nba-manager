export type Player = {
    playerID: number;
    firstName: string;
    lastName: string;
};

export type Team = {
    teamID: number;
    name: string;
    city: string;
    state: string;
};

export type Roster = {
    rosterID: number;
    year: string;
};

export type PlayoffRound = {
    playoffRoundID: number;
    name: string;
};

// TODO: Need to update when building BE query
export type FullRoster = Roster & {
    team: string;
    players: string[];
    playoffRound: string;
};
