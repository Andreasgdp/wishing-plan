import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getAuthSession } from './getServerSession';

export function requireAuthentication(gssp: GetServerSideProps) {
	return async (ctx: GetServerSidePropsContext) => {
		try {
			// get current route
			const route = ctx.resolvedUrl;

			const redirectUrl = route === '/' ? '/product' : '/auth/signin';

			// Send a request to the API and verify that the user exists
			// Reject and redirect if the user is undefined or there is no accessToken
			const session = await getAuthSession(ctx);

			if (!session) {
				return {
					redirect: {
						destination: redirectUrl,
						permanent: false,
					},
				};
			} else {
				ctx.res.setHeader(
					'Cache-Control',
					'public, s-maxage=1000, stale-while-revalidate=604800',
				);
				// If the user exists, return the props
				return await gssp(ctx);
			}
		} catch (error) {
			// Failure in the query or any error should fallback here
			// this route is possibly forbidden means the cookie is invalid
			// or the cookie is expired
			return {
				redirect: {
					permanent: false,
					destination: '/auth/signin',
				},
			};
		}
	};
}
