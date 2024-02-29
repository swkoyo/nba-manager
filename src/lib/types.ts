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
    playoffRoundID: number | null;
    teamID: number;
};

export type PlayoffRound = {
    playoffRoundID: number;
    name: string;
};

export type FullRoster = Roster & {
    team: Team;
    players: Player[];
    playoffRound: PlayoffRound | null;
};

export type AvailableData = {
    teams: Team[];
    players: Player[];
    playoffRounds: PlayoffRound[];
};
