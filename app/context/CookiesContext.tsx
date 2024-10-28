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
	setServiceEnabled: (serviceId: number, enabled: boolean) => void;
	setCookiePreferences: React.Dispatch<
		React.SetStateAction<CookiePreferences>
	>;
	getStoredPreferences: () => CookiePreferences | null;
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
		const localPrefs = localStorage.getItem(COOKIE_NAME);
		return localPrefs ? JSON.parse(localPrefs) : null;
	} catch (error) {
		console.warn("Erreur lors de l'accès aux préférences:", error);
		return null;
	}
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
				setIsConsentBannerVisible(false);
			} else {
				// Ajout d'un délai pour contourner l'auto-consent
				setTimeout(() => {
					setIsConsentBannerVisible(true);
				}, 100);
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
	const setServiceEnabled = (serviceId: number, enabled: boolean) => {
		setCookiePreferences((prev) => {
			const newPreferences = Object.fromEntries(
				Object.entries(prev).map(([category, services]) => [
					category,
					services.map((service: CookieService) =>
						service.id === serviceId ? { ...service, enabled } : service
					),
				])
			) as CookiePreferences;

			setStoredPreferences(newPreferences);
			return newPreferences;
		});
	};

	const contextValue: CookiesContextType = {
		cookiePreferences,
		isLoading,
		savePreferences,
		setIsConsentBannerVisible,
		isConsentBannerVisible,
		isServiceEnabled,
		setServiceEnabled,
		setCookiePreferences,
		getStoredPreferences, // Ajout de cette ligne
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
