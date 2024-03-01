import { NextResponse } from 'next/server';
import { findPlayerByID } from '../helpers';
import { turso } from '@/lib/db/turso';

export async function GET(_: Request, { params }: { params: { id: number } }) {
    try {
        const player = await findPlayerByID(params.id);
        if (!player) {
            throw new Error(`Player ${params.id} not found`);
        }
        return NextResponse.json(player);
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
        const { firstName, lastName } = await request.json();
        const player = await findPlayerByID(params.id);
        if (!player) {
            throw new Error(`Player ${params.id} not found`);
        }
        await turso.execute({
            sql: 'UPDATE Players SET firstName=?, lastName=? WHERE playerID=?',
            args: [firstName, lastName, params.id],
        });
        return NextResponse.json({ message: 'Success' });
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
        const player = await findPlayerByID(params.id);
        if (!player) {
            throw new Error(`Player ${params.id} not found`);
        }
        await turso.execute({
            sql: 'DELETE FROM Players WHERE playerID=?',
            args: [player.playerID],
        });
        return NextResponse.json({ message: 'Success' }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: (err as Error).message },
            { status: 400 }
        );
    }
}
