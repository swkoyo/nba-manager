import { turso } from '@/lib/db/turso';
import { PlayoffRound } from '@/lib/types';

export async function findPlayoffRoundByID(
    playoffRoundID: number
): Promise<PlayoffRound | null> {
    const { rows } = await turso.execute({
        sql: 'SELECT * FROM PlayoffRounds WHERE playoffRoundID=?',
        args: [playoffRoundID],
    });
    if (!rows[0]) {
        return null;
    }
    return rows[0] as unknown as PlayoffRound;
}

export async function isExistingPlayoffRound(
    name: string,
    omitID?: number
): Promise<boolean> {
    let sql = 'SELECT COUNT(*) FROM PlayoffRounds WHERE name=?';
    let args: (string | number)[] = [name];
    if (omitID) {
        sql += ' AND playoffRoundID != ?';
        args.push(omitID);
    }
    const { rows } = await turso.execute({ sql, args });
    return (rows[0]['COUNT (*)'] as number) > 0;
}
