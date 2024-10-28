// context/CookiesContext.tsx
"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { DEFAULT_PREFERENCES } from "@/app/constants/cookieDefaults";

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

export const CookiesProvider: React.FC<CookiesProviderProps> = ({
	children,
}) => {
	const [isConsentBannerVisible, setIsConsentBannerVisible] = useState(false);
	const [cookiePreferences, setCookiePreferences] =
		useState<CookiePreferences>(DEFAULT_PREFERENCES);

	useEffect(() => {
		const loadPreferences = () => {
			const savedPreferences = localStorage.getItem("cookiePreferences");
			if (savedPreferences) {
				setCookiePreferences(JSON.parse(savedPreferences));
				setIsConsentBannerVisible(false);
			} else {
				setIsConsentBannerVisible(true);
			}
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
