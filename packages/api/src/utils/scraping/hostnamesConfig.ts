export type HostnamesConfig = {
  titleSelector: string;
  priceSelector: string;
  imageUrlSelector: string;
};

// map of hostname to selectors
export const hostnamesConfig: Record<string, HostnamesConfig> = {
  "www.pricerunner.com": {
    titleSelector: "h1",
    priceSelector: 'span[data-testid="priceComponent"]',
    imageUrlSelector: "div > div > img",
  },
  "www.pricerunner.dk": {
    titleSelector: "h1",
    priceSelector: 'span[data-testid="priceComponent"]',
    imageUrlSelector: "div > div > img",
  },
  "www.mukama.com": {
    titleSelector: "h1",
    priceSelector: "span#our_price_display",
    imageUrlSelector: "img#bigpic",
  },
};
