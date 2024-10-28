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

const COOKIE_NAME = "cookiePreferences";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 365 jours en secondes

const getStoredPreferences = (): CookiePreferences | null => {
	try {
		// Essayer d'abord localStorage
		const localPrefs = localStorage.getItem(COOKIE_NAME);
		if (localPrefs) {
			return JSON.parse(localPrefs);
		}
	} catch (error) {
		console.warn("Impossible d'accéder au localStorage:", error);
	}

	try {
		// Fallback sur les cookies
		const cookieStore = document.cookie;
		const cookieValue = cookieStore
			.split("; ")
			.find((row) => row.startsWith(COOKIE_NAME))
			?.split("=")[1];

		if (cookieValue) {
			return JSON.parse(decodeURIComponent(cookieValue));
		}
	} catch (error) {
		console.warn("Impossible d'accéder aux cookies:", error);
	}

	return null;
};

const setStoredPreferences = (preferences: CookiePreferences): void => {
	try {
		// Essayer d'abord localStorage
		localStorage.setItem(COOKIE_NAME, JSON.stringify(preferences));
	} catch (error) {
		console.warn("Impossible de sauvegarder dans localStorage:", error);
		try {
			// Fallback sur les cookies
			document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
				JSON.stringify(preferences)
			)}; max-age=${COOKIE_MAX_AGE}; path=/; samesite=strict`;
		} catch (cookieError) {
			console.error(
				"Impossible de sauvegarder les préférences:",
				cookieError
			);
		}
	}
};

interface CookiesProviderProps {
	children: ReactNode;
}

export const CookiesProvider: React.FC<CookiesProviderProps> = ({
	children,
}) => {
	const [isLoading, setIsLoading] = useState(true);
	const [isConsentBannerVisible, setIsConsentBannerVisible] = useState(false);
	const [cookiePreferences, setCookiePreferences] =
		useState<CookiePreferences>(DEFAULT_PREFERENCES);

	useEffect(() => {
		const loadPreferences = () => {
			const storedPreferences = getStoredPreferences();
			if (storedPreferences) {
				setCookiePreferences(storedPreferences);
				setIsConsentBannerVisible(false); // On cache la bannière si des préférences existent
			} else {
				setIsConsentBannerVisible(true); // On montre la bannière uniquement si pas de préférences
			}
			setIsLoading(false);
		};

		loadPreferences();
	}, []);

	const savePreferences = (preferences: CookiePreferences) => {
		setCookiePreferences(preferences);
		setStoredPreferences(preferences);
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
