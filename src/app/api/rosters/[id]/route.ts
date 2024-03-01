import { NextResponse } from 'next/server';
import { turso } from '@/lib/db/turso';
import {
    areExistingRosterPlayers,
    findRosterByID,
    isExistingRoster,
    serializerRoster,
} from '../helpers';
import { DetailedRoster } from '../types';
import { findTeamByID } from '../../teams/helpers';
import { findPlayoffRoundByID } from '../../playoffRounds/helpers';

export async function GET(_: Request, { params }: { params: { id: number } }) {
    try {
        const { rows } = await turso.execute({
            sql: `
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
            LEFT OUTER JOIN PlayoffRounds AS pr ON pr.playoffRoundID = r.playoffRoundID
            LEFT OUTER JOIN RosterPlayers AS rp ON rp.rosterID = r.rosterID
            LEFT OUTER JOIN Players AS p ON rp.playerID = p.playerID
            WHERE r.rosterID = ?
        `,
            args: [params.id],
        });
        if (rows.length === 0) {
            throw new Error(`Roster ${params.id} not found`);
        }
        const res = serializerRoster(rows as unknown as DetailedRoster[]);
        return NextResponse.json(res[0]);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: (err as Error).message },
            { status: 400 }
        );
    }
}
export async function PUT(
    request: Request,
    { params }: { params: { id: number } }
) {
    try {
        const { year, teamID, playoffRoundID, playerIDs } =
            await request.json();
        if (!(await findRosterByID(params.id))) {
            throw new Error(`Roster ${params.id} not found`);
        }
        if (!(await findTeamByID(teamID))) {
            throw new Error(`Team ${teamID} not found`);
        }
        if (playoffRoundID && !(await findPlayoffRoundByID(playoffRoundID))) {
            throw new Error(`Playoff Round ${playoffRoundID} not found`);
        }
        if (await isExistingRoster(teamID, year, params.id)) {
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
        if (await areExistingRosterPlayers(year, playerIDs, params.id)) {
            throw new Error('Players are already in rosters during this year');
        }

        const existingPlayerIDRes = await turso.execute({
            sql: `SELECT playerID FROM RosterPlayers WHERE rosterID=?`,
            args: [params.id],
        });

        const existingPlayerIDs = existingPlayerIDRes.rows.map((r) => r.playerID)
        const newPlayerIDs: number[] = [];
        const removedPlayerIDs: number[] = [];

        for (const existingPlayerID of existingPlayerIDs) {
            if (!playerIDs.includes(existingPlayerID)) {
                removedPlayerIDs.push(existingPlayerID as number);
            }
        }

        for (const playerID of playerIDs) {
            if (!existingPlayerIDs.includes(playerID))
                [newPlayerIDs.push(playerID)];
        }

        const transaction = await turso.transaction('write');

        try {
            await transaction.execute({
                sql: 'UPDATE Rosters SET year=?, teamID=?, playoffRoundID=? WHERE rosterID=?',
                args: [year, teamID, playoffRoundID, params.id],
            });

            if (removedPlayerIDs.length > 0) {
                await transaction.execute({
                    sql: `DELETE FROM RosterPlayers WHERE rosterID=? AND playerID IN (${removedPlayerIDs.join(
                        ', '
                    )})`,
                    args: [params.id],
                });
            }

            if (newPlayerIDs.length > 0) {
                await transaction.batch(
                    newPlayerIDs.map((id) => ({
                        sql: 'INSERT INTO RosterPlayers (rosterID, playerID) VALUES (?, ?)',
                        args: [params.id, id],
                    }))
                );
            }

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

export async function DELETE(
    _: Request,
    { params }: { params: { id: number } }
) {
    try {
        const roster = await findRosterByID(params.id);
        if (!roster) {
            throw new Error(`Roster ${params.id} not found`);
        }
        await turso.batch(
            [
                {
                    sql: 'DELETE FROM RosterPlayers WHERE rosterID=?',
                    args: [roster.rosterID],
                },
                {
                    sql: 'DELETE FROM Rosters WHERE rosterID=?',
                    args: [roster.rosterID],
                },
            ],
            'write'
        );
        return NextResponse.json({ message: 'Success' }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: (err as Error).message },
            { status: 400 }
        );
    }
}
