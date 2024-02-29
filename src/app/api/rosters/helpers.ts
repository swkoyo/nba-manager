import { FullRoster, Roster } from '@/lib/types';
import { DetailedRoster } from './types';
import { turso } from '@/lib/db/turso';

export function serializerRoster(data: DetailedRoster[]): FullRoster[] {
    const rosters: Record<number, FullRoster> = {};
    const res: FullRoster[] = [];

    for (const d of data) {
        if (!rosters[d.rosterID]) {
            rosters[d.rosterID] = {
                rosterID: d.rosterID,
                year: d.year,
                teamID: d.teamID,
                playoffRoundID: d.playoffRoundID,
                team: {
                    teamID: d.teamID,
                    name: d.teamName,
                    city: d.teamCity,
                    state: d.teamState,
                },
                /* eslint-disable */
                playoffRound:
                    d.playoffRoundID && d.playoffRoundName
                        ? {
                              playoffRoundID: d.playoffRoundID,
                              name: d.playoffRoundName,
                          }
                        : null,
                /* eslint-enable */
                players: [],
            };
        }
        rosters[d.rosterID].players.push({
            playerID: d.playerID,
            firstName: d.playerFirstName,
            lastName: d.playerLastName,
        });
    }

    for (const rosterID in rosters) {
        res.push(rosters[rosterID]);
    }

    return res;
}

export async function findRosterByID(id: number): Promise<Roster | null> {
    const { rows } = await turso.execute({
        sql: 'SELECT * FROM Rosters WHERE rosterID=?',
        args: [id],
    });
    if (!rows[0]) {
        return null;
    }
    return rows[0] as unknown as Roster;
}

export async function isExistingRoster(
    teamID: number,
    year: string,
    omitID?: number
): Promise<boolean> {
    let sql = 'SELECT COUNT(*) FROM Rosters WHERE teamID=? AND year=?';
    let args: (string | number)[] = [teamID, year];
    if (omitID) {
        sql += ' AND rosterID != ?';
        args.push(omitID);
    }
    const { rows } = await turso.execute({ sql, args });
    return (rows[0]['COUNT (*)'] as number) > 0;
}

export async function areExistingRosterPlayers(
    year: string,
    playerIDs: number[],
    omitID?: number
): Promise<boolean> {
    let sql = `
    SELECT COUNT(*)
    FROM Rosters AS r
    JOIN RosterPlayers AS rp ON r.rosterID = rp.rosterID
    WHERE r.year=? AND rp.playerID IN (${playerIDs.join(', ')})`;
    let args: (string | number)[] = [year];
    if (omitID) {
        sql += ' AND r.rosterID != ?';
        args.push(omitID);
    }
    const { rows } = await turso.execute({ sql, args });
    return (rows[0]['COUNT (*)'] as number) > 0;
}
