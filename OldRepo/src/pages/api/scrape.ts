import { type NextApiRequest, type NextApiResponse } from 'next';

import { getProductInfo } from '@server/trpc/utils/scraping/scrapeMethodSelector';

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const url = req.query.url?.toString();

		res.status(200).json(await getProductInfo(url ?? ''));
	} catch (e) {
		// 5
		res.status(404).json({
			error: `Error: ${e}`,
		});
	}
};

export default examples;
