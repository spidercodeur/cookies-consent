// context/CookiesContext.tsx
"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";

interface CookieService {
	id: number;
	name: string;
	enabled: boolean;
}

interface CookiePreferences {
	essential: CookieService[];
	analytics: CookieService[];
	marketing: CookieService[];
	functional: CookieService[];
}

interface CookiesContextType {
	cookiePreferences: CookiePreferences;
	isLoading: boolean; // Ajout d'un état de chargement
	savePreferences: (preferences: CookiePreferences) => void;
	setIsConsentBannerVisible: React.Dispatch<React.SetStateAction<boolean>>;
	isConsentBannerVisible: boolean;
	isServiceEnabled: (serviceId: number) => boolean;
	setCookiePreferences: React.Dispatch<
		React.SetStateAction<CookiePreferences>
	>;
}

// Valeurs par défaut des préférences de cookies
const DEFAULT_PREFERENCES: CookiePreferences = {
	essential: [{ id: 0, name: "Core", enabled: true }], // Les cookies essentiels sont toujours activés
	analytics: [{ id: 1, name: "Google Analytics", enabled: false }],
	marketing: [{ id: 2, name: "Facebook Pixel", enabled: false }],
	functional: [
		{ id: 3, name: "YouTube", enabled: false },
		{ id: 4, name: "Facebook", enabled: false },
	],
};

const CookiesContext = createContext<CookiesContextType | undefined>(undefined);

interface CookiesProviderProps {
	children: ReactNode;
}

export const CookiesProvider: React.FC<CookiesProviderProps> = ({
	children,
}) => {
	const [isLoading, setIsLoading] = useState(true);
	const [isConsentBannerVisible, setIsConsentBannerVisible] = useState(true);
	const [cookiePreferences, setCookiePreferences] =
		useState<CookiePreferences>(DEFAULT_PREFERENCES);

	useEffect(() => {
		const loadPreferences = () => {
			const savedPreferences = localStorage.getItem("cookiePreferences");
			if (savedPreferences) {
				setCookiePreferences(JSON.parse(savedPreferences));
			}
			setIsLoading(false);
		};

		loadPreferences();
	}, []);

	const savePreferences = (preferences: CookiePreferences) => {
		setCookiePreferences(preferences);
		localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
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

	const contextValue: CookiesContextType = {
		cookiePreferences,
		isLoading,
		savePreferences,
		setIsConsentBannerVisible,
		isConsentBannerVisible,
		isServiceEnabled,
		setCookiePreferences,
	};

	return (
		<CookiesContext.Provider value={contextValue}>
			{!isLoading && children}
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
