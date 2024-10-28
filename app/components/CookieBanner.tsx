"use client";
// components/CookieBanner.tsx
import React from "react";
import { useCookies } from "../context/CookiesContext";
import { useState } from "react";

const CookieBanner: React.FC = () => {
	const {
		cookiePreferences,
		savePreferences,
		setIsConsentBannerVisible,
		isConsentBannerVisible,
		setCookiePreferences,
	} = useCookies();

	const [showSettings, setShowSettings] = useState(false);

	if (!isConsentBannerVisible) return null;

	const updatePreferences = (
		category: keyof typeof cookiePreferences,
		serviceName: string
	) => {
		const updatedPreferences = { ...cookiePreferences };
		const service = updatedPreferences[category].find(
			(s) => s.name === serviceName
		);
		if (service) {
			service.enabled = !service.enabled;
			// On met juste à jour l'état local sans sauvegarder
			setCookiePreferences(updatedPreferences);
		}
	};

	const handleAllPreferences = (enable: boolean) => {
		const updatedPreferences = { ...cookiePreferences };
		Object.keys(updatedPreferences).forEach((category) => {
			const services =
				updatedPreferences[category as keyof typeof cookiePreferences];
			if (Array.isArray(services)) {
				services.forEach((service) => {
					if (service.id !== 0) {
						service.enabled = enable;
					}
				});
			}
		});
		savePreferences(updatedPreferences);
		setIsConsentBannerVisible(false);
	};

	const ServiceToggle = ({
		service,
		category,
	}: {
		service: { id: number; name: string; enabled: boolean };
		category: keyof typeof cookiePreferences;
	}) => (
		<div className="flex items-center justify-between pl-2 w-full">
			<span className="text-sm pr-3 whitespace-nowrap">
				- {service.name}
				{service.id === 0 && <span className="text-xs">(Essentiel)</span>}
			</span>
			<label className="relative inline-flex cursor-pointer items-center">
				<input
					type="checkbox"
					checked={service.id === 0 ? true : service.enabled}
					onChange={() => updatePreferences(category, service.name)}
					className="peer sr-only"
				/>
				<div
					className={`peer h-4 w-8 rounded-full bg-slate-400 after:absolute after:left-[4px] after:top-0.5 after:h-3 after:w-3 after:rounded-full after:bg-white after:transition-all ${
						service.id === 0
							? "peer-checked:bg-slate-300"
							: "peer-checked:bg-slate-600"
					} peer-checked:after:translate-x-full`}
				></div>
			</label>
		</div>
	);

	return (
		<div
			id="cookie-banner"
			className="fixed bottom-0 left-0 right-0 z-50 max-w-screen-sm bg-white border-t border-gray-100 shadow-lg p-4 rounded-t-xl m-auto"
		>
			<h2 className="text-xl font-semibold flex items-center justify-start">
				<span className="text-5xl pr-5">🍪</span> Préférences de cookies
			</h2>
			<p className="mb-3">
				Nous utilisons des cookies pour optimiser notre site web et notre
				service.
			</p>
			{showSettings && (
				<div className="w-full mt-2 items-end bottom-0 justify-center md:grid md:grid-cols-2 gap-2">
					{Object.entries(cookiePreferences).map(
						([category, services]) => (
							<div
								key={category}
								className="mb-2 w-full bg-slate-50 rounded-2xl p-2"
							>
								<h3 className="text-sm font-semibold capitalize">
									{category}
								</h3>
								{services.map(
									(service: {
										id: number;
										name: string;
										enabled: boolean;
									}) => (
										<ServiceToggle
											key={service.name}
											service={service}
											category={
												category as keyof typeof cookiePreferences
											}
										/>
									)
								)}
							</div>
						)
					)}
				</div>
			)}
			<div className="flex justify-end gap-2 mt-4">
				{showSettings && (
					<button
						onClick={() => setIsConsentBannerVisible(false)}
						className="bg-gray-300 py-1 px-3 rounded-full"
					>
						Sauvegarder
					</button>
				)}
				<button
					onClick={() => setShowSettings(!showSettings)}
					className="bg-gray-300 py-1 px-3 rounded-full"
				>
					Paramètres
				</button>
				<button
					onClick={() => handleAllPreferences(false)}
					className="bg-gray-700 text-white py-1 px-3 rounded-full"
				>
					Refuser
				</button>
				<button
					onClick={() => handleAllPreferences(true)}
					className="bg-gray-700 text-white py-1 px-3 rounded-full"
				>
					Tout accepter
				</button>
			</div>
		</div>
	);
};

export default CookieBanner;
