import { turso } from '@/lib/db/turso';
import { NextResponse } from 'next/server';
import { serializerRoster } from './helpers';
import { DetailedRoster } from './types';

const ROSTER_SQL = `
SELECT
    r.rosterID,
    r.year,
    r.teamID,
    r.playoffRoundID,
    t.name AS teamName,
    t.city AS teamCity,
    t.state AS teamState,
    pr.name AS playoffRoundName,
    p.playerID AS playerID,
    p.firstName AS playerFirstName,
    p.lastName AS playerLastName
FROM Rosters AS r
JOIN Teams AS t ON r.teamID = t.teamID
JOIN RosterPlayers AS rp ON rp.rosterID = r.rosterID
JOIN Players AS p ON rp.playerID = p.playerID
LEFT OUTER JOIN PlayoffRounds AS pr ON pr.playoffRoundID = r.playoffRoundID
ORDER BY r.year, t.name
`;

export async function GET() {
    try {
        const { rows } = await turso.execute(ROSTER_SQL);
        const res = serializerRoster(rows as unknown as DetailedRoster[]);
        return NextResponse.json(res);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: (err as Error).message },
            { status: 400 }
        );
    }
}
