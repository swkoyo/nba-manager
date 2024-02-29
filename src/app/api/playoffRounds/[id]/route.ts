import { turso } from '@/lib/db/turso';
import { findPlayoffRoundByID, isExistingPlayoffRound } from '../helpers';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: number } }) {
    try {
        const round = await findPlayoffRoundByID(params.id);
        if (!round) {
            throw new Error(`PlayoffRound ${params.id} not found`);
        }
        return NextResponse.json(round);
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
        const { name } = await request.json();
        let playoffRound = await findPlayoffRoundByID(params.id);
        if (!playoffRound) {
            throw new Error(`PlayoffRound ${params.id} not found`);
        }
        const isTaken = await isExistingPlayoffRound(name, params.id);
        if (isTaken) {
            throw new Error(`PlayoffRound ${name} already exists`);
        }
        await turso.execute({
            sql: 'UPDATE PlayoffRounds SET name=? WHERE playoffRoundID=?',
            args: [name, params.id],
        });
        playoffRound = await findPlayoffRoundByID(params.id);
        return NextResponse.json(playoffRound);
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
        const playoffRound = await findPlayoffRoundByID(params.id);
        if (!playoffRound) {
            throw new Error(`PlayoffRound ${params.id} not found`);
        }
        await turso.execute({
            sql: 'DELETE FROM PlayoffRounds WHERE playoffRoundID=?',
            args: [params.id],
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
