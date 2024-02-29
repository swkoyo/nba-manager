import { turso } from '@/lib/db/turso';
import { isExistingPlayoffRound } from './helpers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const filterParams = request.nextUrl.searchParams.get('filter');
        const searchParam = request.nextUrl.searchParams.get('search');
        let select = 'SELECT PlayoffRoundID';
        if (filterParams) {
            select += `, ${filterParams}`;
        }
        let where = '';
        if (searchParam) {
            where += ` WHERE name LIKE '%${searchParam}%'`;
        }
        const { rows } = await turso.execute(
            `${select} FROM PlayoffRounds${where}`
        );
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
        return NextResponse.json(rows[0], { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: (err as Error).message },
            { status: 400 }
        );
    }
}
