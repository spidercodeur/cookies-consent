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

// Types
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
	isLoading: boolean;
	savePreferences: (preferences: CookiePreferences) => void;
	setIsConsentBannerVisible: React.Dispatch<React.SetStateAction<boolean>>;
	isConsentBannerVisible: boolean;
	isServiceEnabled: (serviceId: number) => boolean;
	setServiceEnabled: (serviceId: number, enabled: boolean) => void;
	setCookiePreferences: React.Dispatch<
		React.SetStateAction<CookiePreferences>
	>;
}

// Constants
const COOKIE_NAME = "cookiePreferences";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;
const DEFAULT_PREFERENCES: CookiePreferences = JSON.parse(
	JSON.stringify(INITIAL_PREFERENCES)
);

// Context
const CookiesContext = createContext<CookiesContextType | undefined>(undefined);

// Storage utilities
const getCookie = (name: string): string | null => {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2)
		return decodeURIComponent(parts.pop()?.split(";").shift() || "");
	return null;
};

const StorageUtils = {
	get: (): CookiePreferences | null => {
		try {
			const cookieValue = getCookie(COOKIE_NAME);
			return cookieValue ? JSON.parse(cookieValue) : null;
		} catch (error) {
			console.warn("Erreur lors de l'accès aux préférences:", error);
			return null;
		}
	},

	set: (preferences: CookiePreferences): void => {
		try {
			document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
				JSON.stringify(preferences)
			)}; max-age=${COOKIE_MAX_AGE}; path=/; samesite=strict`;
		} catch (error) {
			console.error("Impossible de sauvegarder les préférences:", error);
		}
	},

	clear: (): void => {
		try {
			document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
			document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
		} catch (error) {
			console.warn("Erreur lors du nettoyage des préférences:", error);
		}
	},
};

// Provider Component
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
			const storedPreferences = StorageUtils.get();
			if (storedPreferences) {
				setCookiePreferences(storedPreferences);
				setIsConsentBannerVisible(false);
			} else {
				setTimeout(() => setIsConsentBannerVisible(true), 100);
			}
			setIsLoading(false);
		};

		loadPreferences();
	}, []);

	const savePreferences = (preferences: CookiePreferences) => {
		StorageUtils.clear();
		setCookiePreferences(preferences);
		StorageUtils.set(preferences);
		setTimeout(() => setIsConsentBannerVisible(false), 400);
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

			StorageUtils.set(newPreferences);
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
	};

	return (
		<CookiesContext.Provider value={contextValue}>
			{!isLoading && children}
		</CookiesContext.Provider>
	);
};

// Hook
export const useCookies = (): CookiesContextType => {
	const context = useContext(CookiesContext);
	if (!context) {
		throw new Error("useCookies must be used within a CookiesProvider");
	}
	return context;
};
