// components/ClientCookieProvider.tsx
"use client";

import React from "react";
import { CookiesProvider } from "../context/CookiesContext";
import CookieBanner from "./CookieBanner";

interface ClientCookieProviderProps {
	children: React.ReactNode;
}

const ClientCookieProvider: React.FC<ClientCookieProviderProps> = ({
	children,
}) => {
	//const { isConsentBannerVisible } = useCookies();
	return (
		<CookiesProvider>
			{children}
			<CookieBanner />
			{/* Affiche la bannière si visible */}
		</CookiesProvider>
	);
};

export default ClientCookieProvider;
