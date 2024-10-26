// context/CookiesContext.tsx
"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";

interface CookiePreferences {
	essential: boolean;
	analytics: boolean;
	marketing: boolean;
}

interface CookiesContextType {
	cookiePreferences: CookiePreferences;
	savePreferences: (preferences: CookiePreferences) => void;
	setIsConsentBannerVisible: React.Dispatch<React.SetStateAction<boolean>>;
	isConsentBannerVisible: boolean;
}

const CookiesContext = createContext<CookiesContextType | undefined>(undefined);

interface CookiesProviderProps {
	children: ReactNode;
}

export const CookiesProvider: React.FC<CookiesProviderProps> = ({
	children,
}) => {
	// La bannière est masquée par défaut
	const [isConsentBannerVisible, setIsConsentBannerVisible] =
		useState<boolean>(false);
	const [cookiePreferences, setCookiePreferences] =
		useState<CookiePreferences>({
			essential: true,
			analytics: false,
			marketing: false,
		});

	useEffect(() => {
		// Vérifie si les préférences de cookies existent dans le localStorage
		const savedPreferences = localStorage.getItem("cookiePreferences");

		if (!savedPreferences) {
			// Si aucun cookie de préférences n'est présent, afficher la bannière
			setIsConsentBannerVisible(true);
		} else {
			// Sinon, charger les préférences et masquer la bannière
			setCookiePreferences(JSON.parse(savedPreferences));
		}
	}, []);

	const savePreferences = (preferences: CookiePreferences) => {
		setCookiePreferences(preferences);
		localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
	};

	return (
		<CookiesContext.Provider
			value={{
				cookiePreferences,
				savePreferences,
				setIsConsentBannerVisible,
				isConsentBannerVisible,
			}}
		>
			{children}
		</CookiesContext.Provider>
	);
};

// Fonction utilitaire pour accéder au contexte des cookies
export const useCookies = (): CookiesContextType => {
	const context = useContext(CookiesContext);
	if (!context) {
		throw new Error("useCookies must be used within a CookiesProvider");
	}
	return context;
};
