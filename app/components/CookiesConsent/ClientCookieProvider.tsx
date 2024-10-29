// context/CookiesContext.tsx
"use client";

import { INITIAL_PREFERENCES } from "@/app/components/CookiesConsent/constants/cookieDefaults";
import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

interface CookieService {
	readonly id: number;
	readonly name: string;
	readonly enabled: boolean;
}

interface CookiePreferences {
	readonly essential: ReadonlyArray<CookieService>;
	readonly analytics: ReadonlyArray<CookieService>;
	readonly marketing: ReadonlyArray<CookieService>;
	readonly functional: ReadonlyArray<CookieService>;
}

interface CookiesContextType {
	cookiePreferences: CookiePreferences;
	savePreferences: (preferences: CookiePreferences) => void;
	setIsConsentBannerVisible: React.Dispatch<React.SetStateAction<boolean>>;
	isConsentBannerVisible: boolean;
	isServiceEnabled: (serviceId: number) => boolean;
}

const CookiesContext = createContext<CookiesContextType | undefined>(undefined);

interface CookiesProviderProps {
	children: ReactNode;
}

const isBot = (): boolean => {
	const botPattern =
		/bot|crawler|spider|crawling|lighthouse|pagespeed|gtmetrix|googlebot|baiduspider|yandexbot|bingbot|facebookexternalhit/i;
	return (
		typeof window !== "undefined" &&
		(botPattern.test(navigator.userAgent) ||
			// Détection supplémentaire pour Google PageSpeed Insights
			/Chrome-Lighthouse|PageSpeed|GTmetrix/.test(navigator.userAgent))
	);
};

export const CookiesProvider: React.FC<CookiesProviderProps> = ({
	children,
}) => {
	const [isConsentBannerVisible, setIsConsentBannerVisible] = useState(false);
	const [cookiePreferences, setCookiePreferences] =
		useState<CookiePreferences>(INITIAL_PREFERENCES);

	useEffect(() => {
		// Vérifier d'abord si c'est un bot avant tout traitement
		if (isBot()) {
			const botPreferences = Object.entries(INITIAL_PREFERENCES).reduce(
				(acc, [category, services]) => ({
					...acc,
					[category as keyof CookiePreferences]: services.map(
						(service) => ({
							...service,
							enabled: true,
						})
					),
				}),
				{} as CookiePreferences
			);
			savePreferences(botPreferences);
			setIsConsentBannerVisible(false);
			return;
		}

		// Si ce n'est pas un bot, continuer avec le comportement normal
		const cookieValue = document.cookie
			.split("; ")
			.find((row) => row.startsWith("cookiePreferences="));

		if (cookieValue) {
			const preferences = JSON.parse(
				decodeURIComponent(cookieValue.split("=")[1])
			);
			setCookiePreferences(preferences);
			setIsConsentBannerVisible(false);
		} else {
			setIsConsentBannerVisible(true);
		}
	}, []);

	const savePreferences = (preferences: CookiePreferences) => {
		setCookiePreferences(preferences);
		document.cookie = `cookiePreferences=${encodeURIComponent(
			JSON.stringify(preferences)
		)}; max-age=${365 * 24 * 60 * 60}; path=/; samesite=strict`;
		setIsConsentBannerVisible(false);
	};

	const isServiceEnabled = (serviceId: number): boolean => {
		return Object.values(cookiePreferences).some((category) =>
			category.some(
				(service: CookieService) =>
					service.id === serviceId && service.enabled
			)
		);
	};

	return (
		<CookiesContext.Provider
			value={{
				cookiePreferences,
				savePreferences,
				setIsConsentBannerVisible,
				isConsentBannerVisible,
				isServiceEnabled,
			}}
		>
			{children}
		</CookiesContext.Provider>
	);
};

export const useCookies = (): CookiesContextType => {
	const context = useContext(CookiesContext);
	if (!context) {
		throw new Error("useCookies must be used within a CookiesProvider");
	}
	return context;
};

export default CookiesProvider;
