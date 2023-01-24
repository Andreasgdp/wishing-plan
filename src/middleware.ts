import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
	if (req.nextUrl.pathname.startsWith('/url')) {
		const slug = req.nextUrl.pathname.split('/').pop();

		const slugFetch = await fetch(`${req.nextUrl.origin}/api/get-url/${slug}`);
		if (slugFetch.status === 404) {
			return NextResponse.redirect(req.nextUrl.origin);
		}
		const data = await slugFetch.json();

		if (data?.url) {
			return NextResponse.redirect(data.url);
		}
	}
}
