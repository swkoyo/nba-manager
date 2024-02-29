import { NextResponse } from 'next/server';
import { findTeamByID, isExistingTeam } from '../helpers';
import { turso } from '@/lib/db/turso';

export async function GET(_: Request, { params }: { params: { id: number } }) {
    try {
        const team = await findTeamByID(params.id);
        if (!team) {
            throw new Error(`Team ${params.id} not found`);
        }
        return NextResponse.json(team);
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
        const { name, city, state } = await request.json();
        let team = await findTeamByID(params.id);
        if (!team) {
            throw new Error(`Team ${params.id} not found`);
        }
        const isTaken = await isExistingTeam(name, params.id);
        if (isTaken) {
            throw new Error(`Team ${name} already exists`);
        }
        await turso.execute({
            sql: 'UPDATE Teams SET name=?, city=?, state=? WHERE teamID=?',
            args: [name, city, state, params.id],
        });
        team = await findTeamByID(params.id);
        return NextResponse.json(team);
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
        const team = await findTeamByID(params.id);
        if (!team) {
            throw new Error(`Team ${params.id} not found`);
        }
        await turso.execute({
            sql: 'DELETE FROM Teams WHERE teamID=?',
            args: [params.id],
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
