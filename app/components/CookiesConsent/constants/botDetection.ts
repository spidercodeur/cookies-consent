export const isBot = (): boolean => {
	const botPattern =
		/bot|crawler|spider|crawling|lighthouse|pagespeed|gtmetrix|googlebot|baiduspider|yandexbot|bingbot|facebookexternalhit/i;
	return (
		typeof window !== "undefined" &&
		(botPattern.test(navigator.userAgent) ||
			/Chrome-Lighthouse|PageSpeed|GTmetrix/.test(navigator.userAgent))
	);
};
