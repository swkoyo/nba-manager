import { turso } from '@/lib/db/turso';
import { Player } from '@/lib/types';

export async function findPlayerByID(playerID: number): Promise<Player | null> {
    const { rows } = await turso.execute({
        sql: 'SELECT * FROM Players WHERE playerID=?',
        args: [playerID],
    });
    if (!rows[0]) {
        return null;
    }
    return rows[0] as unknown as Player;
}
