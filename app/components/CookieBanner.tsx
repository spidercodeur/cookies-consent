"use client";
// components/CookieBanner.tsx
import { useCookies } from "../context/CookiesContext";

const CookieBanner: React.FC = () => {
	const {
		cookiePreferences,
		savePreferences,
		setIsConsentBannerVisible,
		isConsentBannerVisible,
	} = useCookies();

	const handleSavePreferences = () => {
		savePreferences({ ...cookiePreferences, essential: true });
		setIsConsentBannerVisible(false);
		console.log("Preferences saved, hiding banner");
	};

	const handleAcceptAll = () => {
		savePreferences({ essential: true, analytics: true, marketing: true });
		setIsConsentBannerVisible(false);
	};

	const reopenCookieBanner = () => {
		setIsConsentBannerVisible(true);
	};
	return (
		<>
			{isConsentBannerVisible && (
				<div className="fixed m-auto max-w-screen-md bottom-0 left-0 right-0 rounded-t-2xl bg-gray-100 shadow-lg p-4 flex flex-col gap-4 border-t">
					<h2 className="text-lg font-semibold">Préférences de cookies</h2>
					<p>
						Nous utilisons des cookies pour optimiser notre site web et
						notre service.
					</p>

					<div className="flex items-center justify-between">
						<span>Cookies essentiels</span>
						<label className="relative inline-flex cursor-pointer items-center">
							<input
								type="checkbox"
								checked
								disabled
								className="peer sr-only"
							/>
							<div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-slate-400 peer-checked:after:translate-x-full"></div>
						</label>{" "}
					</div>

					<div className="flex items-center justify-between">
						<span>Cookies analytiques</span>
						<label className="relative inline-flex cursor-pointer items-center">
							<input
								type="checkbox"
								checked={cookiePreferences.analytics}
								onChange={() =>
									savePreferences({
										...cookiePreferences,
										analytics: !cookiePreferences.analytics,
									})
								}
								className="peer sr-only"
							/>
							<div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-slate-800 peer-checked:after:translate-x-full"></div>
						</label>
					</div>

					<div className="flex items-center justify-between">
						<span>Cookies marketing</span>
						<label className="relative inline-flex cursor-pointer items-center">
							<input
								type="checkbox"
								checked={cookiePreferences.marketing}
								onChange={() =>
									savePreferences({
										...cookiePreferences,
										marketing: !cookiePreferences.marketing,
									})
								}
								className="peer sr-only"
							/>
							<div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-slate-800 peer-checked:after:translate-x-full"></div>
						</label>
					</div>

					<div className="flex justify-end gap-2">
						<button
							onClick={handleSavePreferences}
							className="bg-gray-300 py-1 px-3 rounded"
						>
							Enregistrer
						</button>
						<button
							onClick={() => handleAcceptAll()}
							className="bg-blue-500 text-white py-1 px-3 rounded"
						>
							Tout accepter
						</button>
					</div>
				</div>
			)}
			{/* Lien pour rouvrir la bannière */}
			<div>
				<button
					className="rounded-full border border-solid border-black/[.08] py-1 px-3 w-48"
					onClick={() =>
						isConsentBannerVisible
							? setIsConsentBannerVisible(false)
							: reopenCookieBanner()
					}
				>
					{isConsentBannerVisible
						? "Fermer la bannière"
						: "Ouvrir la bannière"}
				</button>
			</div>
		</>
	);
};

export default CookieBanner;
