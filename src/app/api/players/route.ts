import { turso } from '@/lib/turso';
import { findPlayerByID } from './helpers';

export async function GET() {
    try {
        const { rows } = await turso.execute('SELECT * FROM Players');
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
        const { firstName, lastName } = await request.json();
        await turso.execute({
            sql: 'INSERT INTO Players (firstName, lastName) VALUES (?, ?)',
            args: [firstName, lastName],
        });
        const { rows } = await turso.execute({
            sql: 'SELECT * FROM Players WHERE firstName=? AND lastName=? ORDER BY playerID DESC LIMIT 1',
            args: [firstName, lastName],
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
        const { playerID, firstName, lastName } = await request.json();
        let player = await findPlayerByID(playerID);
        if (!player) {
            throw new Error(`Player ${playerID} not found`);
        }
        await turso.execute({
            sql: 'UPDATE Players SET firstName=?, lastName=? WHERE playerID=?',
            args: [firstName, lastName, playerID],
        });
        player = await findPlayerByID(playerID);
        return Response.json(player, { status: 200 });
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
        const { playerID } = await request.json();
        const player = await findPlayerByID(playerID);
        if (!player) {
            throw new Error(`Player ${playerID} not found`);
        }
        await turso.execute({
            sql: 'DELETE FROM Players WHERE playerID=?',
            args: [playerID],
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
