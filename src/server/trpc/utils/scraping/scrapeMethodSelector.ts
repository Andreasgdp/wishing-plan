import axios from 'axios';
import * as cheerio from 'cheerio';

export const siteScraper = async (
	url: string,
	titleSelector: string,
	priceSelector: string,
	imageUrlSelector: string,
) => {
	try {
		const { data } = await axios.get(url);
		const $ = cheerio.load(data);

		const title = $(titleSelector).first().text();

		const price = $(priceSelector).first().text();
		const numerPrice = Number(price.replace(/\D+/g, ''));

		const imageUrl = $(imageUrlSelector).first().attr('src');

		return {
			title: title,
			price: numerPrice,
			imageUrl: imageUrl ?? '',
		};
	} catch (e) {
		return {
			title: '',
			price: 0,
			imageUrl: '',
		};
	}
};

export const getProductInfo = async (url: string) => {
	const { hostname } = new URL(url);

	switch (hostname) {
		case 'www.pricerunner.com':
		case 'www.pricerunner.dk':
			return siteScraper(
				url,
				'h1',
				'span[data-testid="priceComponent"]',
				'div > div > img',
			);
		case 'www.mukama.com':
			return siteScraper(url, 'h1', 'span#our_price_display', 'img#bigpic');
		default:
			return {
				title: '',
				price: 0,
				imageUrl: '',
			};
	}
};
