import { turso } from '@/lib/db/turso';
import { NextResponse } from 'next/server';
import {
    areExistingRosterPlayers,
    isExistingRoster,
    serializerRoster,
} from './helpers';
import { DetailedRoster } from './types';
import { findTeamByID } from '../teams/helpers';
import { findPlayoffRoundByID } from '../playoffRounds/helpers';

export async function GET() {
    try {
        const { rows } = await turso.execute(`
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
        `);
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

export async function POST(request: Request) {
    try {
        const { year, teamID, playoffRoundID, playerIDs } =
            await request.json();
        if (!(await findTeamByID(teamID))) {
            throw new Error(`Team ${teamID} not found`);
        }
        if (playoffRoundID && !(await findPlayoffRoundByID(playoffRoundID))) {
            throw new Error(`Playoff Round ${playoffRoundID} not found`);
        }
        if (await isExistingRoster(teamID, year)) {
            throw new Error('Roster already exists');
        }
        const playerIDRes = await turso.execute(
            `SELECT COUNT(*) FROM Players WHERE playerID IN (${playerIDs.join(
                ', '
            )})`
        );
        if ((playerIDRes.rows[0]['COUNT (*)'] as number) != playerIDs.length) {
            throw new Error('Some players not found');
        }
        if (await areExistingRosterPlayers(year, playerIDs)) {
            throw new Error('Players are already in rosters during this year');
        }

        const transaction = await turso.transaction('write');
        try {
            await transaction.execute({
                sql: 'INSERT INTO Rosters (year, teamID, playoffRoundID) VALUES (?, ?, ?)',
                args: [year, teamID, playoffRoundID],
            });

            const rosterRes = await transaction.execute({
                sql: 'SELECT rosterID FROM Rosters WHERE year=? AND teamID=? ORDER BY rosterID DESC LIMIT 1',
                args: [year, teamID],
            });

            await transaction.batch(
                playerIDs.map((id: number) => ({
                    sql: 'INSERT INTO RosterPlayers (rosterID, playerID) VALUES (?, ?)',
                    args: [rosterRes.rows[0].rosterID, id],
                }))
            );
            await transaction.commit();
            return NextResponse.json({ message: 'Success' });
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: (err as Error).message },
            { status: 400 }
        );
    }
}
