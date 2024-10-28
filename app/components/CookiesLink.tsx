"use client";
// components/CookieBanner.tsx
import React from "react";
import { useCookies } from "../context/CookiesContext";

interface LinkCookiesProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text: string;
}

const CookiesLink: React.FC<LinkCookiesProps> = ({
	text,
	className = "",
	...props
}) => {
	const { isConsentBannerVisible, setIsConsentBannerVisible } = useCookies();

	return (
		<>
			{isConsentBannerVisible ? "visible" : "non visible"}
			<button
				onClick={() => setIsConsentBannerVisible(true)}
				className={` ${className}`.trim()}
				{...props}
			>
				{text}
			</button>
		</>
	);
};

export default CookiesLink;
