import axios from "axios";
import * as cheerio from "cheerio";
import { hostnamesConfig } from "./hostnamesConfig";

export const siteScraper = async (
  url: string,
  titleSelector: string,
  priceSelector: string,
  imageUrlSelector: string,
) => {
  try {
    const { hostname } = new URL(url);

    if (!hostnamesConfig.hasOwnProperty(hostname)) {
      return {
        title: "",
        price: 0,
        imageUrl: "",
      };
    }

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $(titleSelector).first().text();

    const price = $(priceSelector).first().text();
    const numerPrice = Number(price.replace(/\D+/g, ""));

    const imageUrl = $(imageUrlSelector).first().attr("src");

    return {
      title: title,
      price: numerPrice,
      imageUrl: imageUrl ?? "",
    };
  } catch (e) {
    return {
      title: "",
      price: 0,
      imageUrl: "",
    };
  }
};

export const getProductInfo = async (url: string) => {
  const { hostname } = new URL(url);

  const currentHostnamesConfig = hostnamesConfig[hostname];

  if (!currentHostnamesConfig) {
    return {
      title: "",
      price: 0,
      imageUrl: "",
    };
  }

  return await siteScraper(
    url,
    currentHostnamesConfig.titleSelector,
    currentHostnamesConfig.priceSelector,
    currentHostnamesConfig.imageUrlSelector,
  );
};
