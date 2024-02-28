import { turso } from '@/lib/db/turso';
import { Team } from '@/lib/types';

export async function findTeamByID(teamID: number): Promise<Team | null> {
    const { rows } = await turso.execute({
        sql: 'SELECT * FROM Teams WHERE teamID=?',
        args: [teamID],
    });
    if (!rows[0]) {
        return null;
    }
    return rows[0] as unknown as Team;
}

export async function isExistingTeam(
    name: string,
    omitID?: number
): Promise<boolean> {
    let sql = 'SELECT COUNT(*) FROM Teams WHERE name=?';
    let args: (string | number)[] = [name];
    if (omitID) {
        sql += ' AND teamID != ?';
        args.push(omitID);
    }
    const { rows } = await turso.execute({ sql, args });
    return (rows[0]['COUNT (*)'] as number) > 0;
}
