import { turso } from './turso';

const CREATE_PLAYERS_SQL = `
CREATE TABLE IF NOT EXISTS Players (
    playerID INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL
)
`;

const CREATE_PLAYOFF_ROUNDS_SQL = `
CREATE TABLE IF NOT EXISTS PlayoffRounds (
    playoffRoundID INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
)
`;

const CREATE_TEAMS_SQL = `
CREATE TABLE IF NOT EXISTS Teams (
    teamID INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    city TEXT NOT NULL,
    state TEXT NOT NULL
)
`;

const CREATE_ROSTERS_SQL = `
CREATE TABLE IF NOT EXISTS Rosters (
    rosterID INTEGER PRIMARY KEY AUTOINCREMENT,
    year TEXT NOT NULL,
    teamID INTEGER NOT NULL,
    playoffRoundID INTEGER,
    FOREIGN KEY (teamID) REFERENCES Teams(teamID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (playoffRoundID) REFERENCES PlayoffRounds(playoffRoundID) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT unique_team_roster_year UNIQUE (teamID, year)
)
`;

const CREATE_ROSTER_PLAYERS_SQL = `
CREATE TABLE IF NOT EXISTS RosterPlayers (
    rosterPlayerID INTEGER PRIMARY KEY AUTOINCREMENT,
    playerID INTEGER NOT NULL,
    rosterID INTEGER NOT NULL,
    FOREIGN KEY (playerID) REFERENCES Players(playerID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (rosterID) REFERENCES Rosters(rosterID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT unique_roster_player UNIQUE (playerID, rosterID)
)
`;

(async () => {
    try {
        console.log('Running migrations...');
        await turso.batch(
            [
                CREATE_PLAYERS_SQL,
                CREATE_PLAYOFF_ROUNDS_SQL,
                CREATE_TEAMS_SQL,
                CREATE_ROSTERS_SQL,
                CREATE_ROSTER_PLAYERS_SQL,
            ],
            'write'
        );
        console.log('Migrations applied!');
    } catch (err) {
        console.error(err);
    }
})();
