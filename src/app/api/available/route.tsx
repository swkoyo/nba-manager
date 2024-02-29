import { turso } from '@/lib/db/turso';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const playersRes = await turso.execute('SELECT * FROM Players');
        const teamsRes = await turso.execute('SELECT * FROM Teams');
        const playoffRoundsRes = await turso.execute(
            'SELECT * FROM PlayoffRounds'
        );
        return NextResponse.json({
            teams: teamsRes.rows,
            players: playersRes.rows,
            playoffRounds: playoffRoundsRes.rows,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: (err as Error).message },
            { status: 400 }
        );
    }
}
