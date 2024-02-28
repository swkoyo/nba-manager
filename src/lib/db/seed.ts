import { turso } from './turso';

const SEED_TEAMS_SQL = `
INSERT INTO Teams (name, city, state) VALUES
    ('Lakers', 'Los Angeles', 'CA'),
    ('Celtics', 'Boston', 'MA'),
    ('Clippers', 'Los Angeles', 'CA'),
    ('Warriors', 'San Francisco', 'CA'),
    ('Kings', 'Sacramento', 'CA'),
    ('Suns', 'Phoenix', 'AZ'),
    ('Jazz', 'Utah', 'UT'),
    ('Nuggets', 'Denver', 'CO'),
    ('Trail Blazers', 'Portland', 'OR'),
    ('Thunder', 'Oklahoma City', 'OK'),
    ('Timberwolves', 'Minnesota', 'MN'),
    ('Mavericks', 'Dallas', 'TX'),
    ('Rockets', 'Houston', 'TX'),
    ('Grizzlies', 'Memphis', 'TN'),
    ('Pelicans', 'New Orleans', 'LA'),
    ('Spurs', 'San Antonio', 'TX'),
    ('Hawks', 'Atlanta', 'GA'),
    ('Nets', 'Brooklyn', 'NY'),
    ('Hornets', 'Charlotte', 'NC'),
    ('Bulls', 'Chicago', 'IL'),
    ('Cavaliers', 'Cleveland', 'OH'),
    ('Pistons', 'Detroit', 'MI'),
    ('Pacers', 'Indiana', 'IN'),
    ('Heat', 'Miami', 'FL'),
    ('Bucks', 'Milwaukee', 'WI'),
    ('Knicks', 'New York', 'NY'),
    ('Magic', 'Orlando', 'FL'),
    ('76ers', 'Philadelphia', 'PA'),
    ('Raptors', 'Toronto', 'ON'),
    ('Wizards', 'Washington', 'DC')
`;

const SEED_PLAYOFF_ROUNDS_SQL = `
INSERT INTO PlayoffRounds (name) VALUES
    ('First Round'),
    ('Conference Semifinals'),
    ('Conference Finals'),
    ('NBA Finals')
`;

const SEED_PLAYERS_SQL = `
INSERT INTO Players (firstName, lastName) VALUES
    ('LeBron', 'James'),
    ('Anthony', 'Davis'),
    ('D''Angelo', 'Russell'),
    ('Rui', 'Hachimura'),
    ('Austin', 'Reaves'),
    ('Dennis', 'Schroder'),
    ('Russell', 'Westbrook'),
    ('Patrick', 'Beverley'),
    ('Jrue', 'Holiday'),
    ('Kristaps', 'Porzingis'),
    ('Jaylen', 'Brown'),
    ('Jayson', 'Tatum'),
    ('Derrick', 'White'),
    ('Robert', 'Williams'),
    ('Grant', 'Williams'),
    ('Payton', 'Pritchard')
`;

const SEED_ROSTERS_SQL = `
INSERT INTO Rosters (year, teamID, playoffRoundID) VALUES
    ('2024', 1, NULL),
    ('2023', 1, 3),
    ('2024', 2, NULL),
    ('2023', 2, 4)
`;

const SEED_ROSTER_PLAYERS_SQL = `
INSERT INTO RosterPlayers (playerID, rosterID) VALUES
    (1, 1),
    (2, 1),
    (3, 1),
    (4, 1),
    (5, 1),
    (1, 2),
    (2, 2),
    (6, 2),
    (7, 2),
    (8, 2),
    (9, 3),
    (10, 3),
    (11, 3),
    (12, 3),
    (13, 3),
    (11, 4),
    (12, 4),
    (14, 4),
    (15, 4),
    (16, 4)
`;

(async () => {
    try {
        console.log('Adding seed data...');
        await turso.batch(
            [
                SEED_TEAMS_SQL,
                SEED_PLAYOFF_ROUNDS_SQL,
                SEED_PLAYERS_SQL,
                SEED_ROSTERS_SQL,
                SEED_ROSTER_PLAYERS_SQL,
            ],
            'write'
        );
        console.log('Seed data applied!');
    } catch (err) {
        console.error(err);
    }
})();
