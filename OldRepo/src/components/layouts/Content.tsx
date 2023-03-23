import type { ReactNode } from 'react';

import { motion } from 'framer-motion';
import Head from 'next/head';

const variants = {
	hidden: { opacity: 0, x: 0, y: 20 },
	enter: { opacity: 1, x: 0, y: 0 },
	exit: { opacity: 0, x: 0, y: 20 },
};

type ArticleLayoutProps = {
	children: ReactNode;
	title?: string;
};

export const Content = ({ children, title }: ArticleLayoutProps) => (
	<motion.article
		initial="hidden"
		animate="enter"
		exit="exit"
		variants={variants}
		transition={{ duration: 0.1, type: 'easeInOut' }}
		style={{ position: 'relative' }}
	>
		<>
			{title && (
				<Head>
					<title>{title}</title>
				</Head>
			)}
			{children}
		</>
	</motion.article>
);
