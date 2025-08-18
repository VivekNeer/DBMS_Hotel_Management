import mysql from 'mysql2/promise';
import { GetDBSettings, IDBSettings } from '@/sharedCode/common'
import { NextResponse , NextRequest} from 'next/server';

let connectionParams = GetDBSettings()

export async function GET(request: NextRequest) {
    try {
        const connection = await mysql.createConnection(connectionParams);

        const query = 'SELECT * FROM rooms;';
        const [results] = await connection.execute(query);

        await connection.end();

        return NextResponse.json(results);
    }catch (error) {
        console.error('Error executing query:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
