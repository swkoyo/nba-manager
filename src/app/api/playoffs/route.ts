import { turso } from '@/lib/db/turso';
import { findPlayoffRoundByID, isExistingPlayoffRound } from './helpers';

export async function GET() {
    try {
        const { rows } = await turso.execute('SELECT * FROM PlayoffRounds');
        return Response.json(rows);
    } catch (err) {
        console.error(err);
        return Response.json(
            { message: (err as Error).message },
            { status: 400 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { name } = await request.json();
        const isTaken = await isExistingPlayoffRound(name);
        if (isTaken) {
            throw new Error(`PlayoffRound ${name} already exists`);
        }
        await turso.execute({
            sql: 'INSERT INTO PlayoffRounds (name) VALUES (?)',
            args: [name],
        });
        const { rows } = await turso.execute({
            sql: 'SELECT * FROM PlayoffRounds WHERE name=?',
            args: [name],
        });
        return Response.json(rows[0], { status: 201 });
    } catch (err) {
        console.error(err);
        return Response.json(
            { message: (err as Error).message },
            { status: 400 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const { playoffRoundID, name } = await request.json();
        let playoffRound = await findPlayoffRoundByID(playoffRoundID);
        if (!playoffRound) {
            throw new Error(`PlayoffRound ${playoffRoundID} not found`);
        }
        const isTaken = await isExistingPlayoffRound(name, playoffRoundID);
        if (isTaken) {
            throw new Error(`PlayoffRound ${name} already exists`);
        }
        await turso.execute({
            sql: 'UPDATE PlayoffRounds SET name=? WHERE playoffRoundID=?',
            args: [name, playoffRoundID],
        });
        playoffRound = await findPlayoffRoundByID(playoffRoundID);
        return Response.json(playoffRound, { status: 200 });
    } catch (err) {
        console.error(err);
        return Response.json(
            { message: (err as Error).message },
            { status: 400 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { playoffRoundID } = await request.json();
        const playoffRound = await findPlayoffRoundByID(playoffRoundID);
        if (!playoffRound) {
            throw new Error(`PlayoffRound ${playoffRoundID} not found`);
        }
        await turso.execute({
            sql: 'DELETE FROM PlayoffRounds WHERE playoffRoundID=?',
            args: [playoffRoundID],
        });
        return Response.json({ message: 'Success' }, { status: 200 });
    } catch (err) {
        console.error(err);
        return Response.json(
            { message: (err as Error).message },
            { status: 400 }
        );
    }
}
