import { getToken } from 'next-auth/jwt';
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

	// !Route protection
	const session = await getToken({ req });
	if (!session) {
		// Write the above using if
		if (req.nextUrl.pathname === '/') {
			return NextResponse.redirect(`${req.nextUrl.origin}/product`);
		}

		if (req.nextUrl.pathname.startsWith('/wishlists')) {
			return NextResponse.redirect(`${req.nextUrl.origin}/auth/signin`);
		}

		if (req.nextUrl.pathname === '/plan') {
			return NextResponse.redirect(`${req.nextUrl.origin}/auth/signin`);
		}

		if (req.nextUrl.pathname.startsWith('/shared-plans')) {
			return NextResponse.redirect(`${req.nextUrl.origin}/auth/signin`);
		}

		if (req.nextUrl.pathname.startsWith('/settings')) {
			return NextResponse.redirect(`${req.nextUrl.origin}/auth/signin`);
		}
	}

	return NextResponse.next();
}
