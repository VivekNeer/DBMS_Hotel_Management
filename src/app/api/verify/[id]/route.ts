import { NextResponse , NextRequest} from 'next/server';

export async function GET(request: NextRequest) {
    const results = {
        message: 'Hello from the API route!',
    }
    return NextResponse.json(results);
}