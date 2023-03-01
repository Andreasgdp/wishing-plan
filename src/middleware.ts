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

	const session = await getToken({ req });
	if (!session) {
		return routeProtectionRedirect(req.nextUrl.pathname, req.nextUrl.origin)
	}

	return NextResponse.next();
}


function routeProtectionRedirect(routeToCheck: string, origin: string) {
	if (routeToCheck === '/') {
		return NextResponse.redirect(`${origin}/product`);
	}
	
	if (routeToCheck === '/plan') {
		return NextResponse.redirect(`${origin}/auth/signin`);
	}
	
	if (routeToCheck.startsWith('/shared-plans')) {
		return NextResponse.redirect(`${origin}/auth/signin`);
	}
	
	if (routeToCheck.startsWith('/wishlists')) {
		return NextResponse.redirect(`${origin}/auth/signin`);
	}

	if (routeToCheck.startsWith('/settings')) {
		return NextResponse.redirect(`${origin}/auth/signin`);
	}

	return NextResponse.next();
}