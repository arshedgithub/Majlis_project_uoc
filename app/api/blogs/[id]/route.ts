import { NextRequest, NextResponse } from 'next/server';
import blogs from '@/db/blogs.json';

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const segments = url.pathname.split("/");
    const id = segments[segments.length - 1];

    const blog = blogs.find((b) => b.id === id);

    if (!blog) {
        return NextResponse.json(
            { success: false, error: 'Blog not found' },
            { status: 404 }
        );
    }

    return NextResponse.json(
        { success: true, data: blog },
        { status: 200 }
    );
}
