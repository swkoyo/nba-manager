import { turso } from '@/lib/db/turso';
import { isExistingTeam } from './helpers';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { rows } = await turso.execute('SELECT * FROM Teams');
        return NextResponse.json(rows);
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
        const { name, city, state } = await request.json();
        const isTaken = await isExistingTeam(name);
        if (isTaken) {
            throw new Error(`Team ${name} already exists`);
        }
        await turso.execute({
            sql: 'INSERT INTO Teams (name, city, state) VALUES (?, ?, ?)',
            args: [name, city, state],
        });
        const { rows } = await turso.execute({
            sql: 'SELECT * FROM Teams WHERE name=?',
            args: [name],
        });
        return NextResponse.json(rows[0], { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: (err as Error).message },
            { status: 400 }
        );
    }
}
