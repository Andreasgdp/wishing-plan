import NextAuth, { type NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import { prisma } from '@server/db/client';
import { signInChecks } from '@server/trpc/utils/auth/signInUtils';
import { env } from 'src/env.mjs';

const secret = process.env.NEXTAUTH_SECRET;

export const authOptions: NextAuthOptions = {
	callbacks: {
		jwt: async ({ token, user }) => {
			if (user) {
				token.id = user.id;
				token.user = user;
			}

			return token;
		},
		async signIn({ user }) {
			if (user.name) {
				return true;
			} else {
				// User has no custom name yet, redirect him
				return '/userInfo';
			}
		},
		session: async ({ session, token }) => {
			if (token && token.user) {
				session.user = token.user;
				await signInChecks(token.user);
			}

			return session;
		},
	},
	jwt: {
		maxAge: 15 * 24 * 30 * 60, // 15 days
	},
	secret: secret,
	session: {
		strategy: 'jwt',
	},
	// Configure one or more authentication providers
	adapter: PrismaAdapter(prisma),
	providers: [
		EmailProvider({
			server: env.EMAIL_SERVER,
			from: env.EMAIL_FROM,
		}),
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code',
				},
			},
			allowDangerousEmailAccountLinking: true,
		}),
		DiscordProvider({
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
			allowDangerousEmailAccountLinking: true,
		}),
	],
	theme: {
		colorScheme: 'auto', // "auto" | "dark" | "light"
		brandColor: '#ed64a6', // Hex color code
	},
	pages: {
		signIn: '/auth/signin',
	},
};

export default NextAuth(authOptions);
