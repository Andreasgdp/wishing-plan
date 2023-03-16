import withPWA from 'next-pwa';

// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 * 
 * @example SKIP_ENV_VALIDATION=1 yarn build
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env/server.mjs'));

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,
	swcMinify: true,
	i18n: {
		locales: ['en'],
		defaultLocale: 'en',
	},
};

const nextConfig = withPWA({
	dest: 'public',
})(config);

export default nextConfig;
