import { turso } from '@/lib/db/turso';
import { isExistingTeam } from './helpers';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const filterParams = request.nextUrl.searchParams.get('filter');
        const searchParam = request.nextUrl.searchParams.get('search');
        let select = 'SELECT teamID';
        if (filterParams) {
            select += `, ${filterParams} `;
        }
        let where = '';
        if (searchParam) {
            where += ` WHERE name LIKE '%${searchParam}%' OR city LIKE '%${searchParam}%' OR state LIKE '%${searchParam}%'`;
        }
        const { rows } = await turso.execute(`${select} FROM Teams${where}`);
        return NextResponse.json(rows);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: (err as Error).message },
            { status: 400 }
        );
    }
}

export async function POST(request: NextRequest) {
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
        return NextResponse.json({ message: 'Success' }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: (err as Error).message },
            { status: 400 }
        );
    }
}
