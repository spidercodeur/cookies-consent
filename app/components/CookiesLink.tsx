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
	const { setIsConsentBannerVisible } = useCookies();

	return (
		<>
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
