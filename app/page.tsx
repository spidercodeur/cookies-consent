import Image from "next/image";
import CookiesLink from "./components/CookiesConsent/CookiesLink";
import AnalyticsComponent from "./components/AnalyticsComponent";
import YoutubeComponent from "./components/YoutubeComponent";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Démo intégration de Cookies consentement avec Nextjs RGPD",
	description:
		"Intégration de Cookies consentement avec Nextjs RGPD, avec gestion des services",
};

// Composant pour les exemples de code
const CodeExample = ({ title, code }: { title: string; code: string }) => (
	<div className="mt-6">
		<b>{title}</b>
		<pre className="text-sm bg-slate-200 p-3 mb-4 w-fit">
			<code className="whitespace-break-spaces">{code}</code>
		</pre>
	</div>
);

export default function Home() {
	return (
		<div className="max-w-full">
			<main className="">
				<div className="max-w-screen-md mx-auto p-3 text-sm  sm:text-left font-[family-name:var(--font-geist-mono)] w-90">
					<p className="text-lg">Démo intégration</p>
					<h1 className="text-3xl font-bold">
						Gestion cookies avec{" "}
						<Image
							src="/next.svg"
							alt="Next.js logo"
							width={180}
							height={38}
							priority
							className=" mt-3"
						/>
					</h1>
					<p className="text-base my-5">
						Acceptation des cookies en fonctions de services, intégration
						simplifiée.
					</p>
					<Link
						href="https://github.com/spidercodeur/cookies-consent"
						className="hover:underline hover:underline-offset-4 font-bold underline-offset-2 mb-5"
					>
						→ Voir la source Github
					</Link>
					<h2 className="text-lg font-bold mt-5">Exemples :</h2>
					<CodeExample
						title="DEFAULT_PREFERENCES, GA désactivé par default :"
						code={`analytics: [{ id: 1, name: "Google Analytics", enabled: false }]`}
					/>

					<CodeExample
						title="JSX :"
						code={`{ !isServiceEnabled(1) ?
    <span className="text-red-600">Google Analytics non actif</span>:
    <span className="text-green-600">Google Analytics actif</span> 
}`}
					/>

					<p>
						<b>Rendu :</b> <AnalyticsComponent />
					</p>

					<CodeExample
						title="Afficher un lien n'importe où :"
						code={`<LinkCookies text="Gestion des cookies" />`}
					/>
					<b>Rendu :</b>
					<CookiesLink
						text="Gestion des cookies"
						className="underline"
					/>

					<div className="mt-10">
						ComponentYouTube :
						<YoutubeComponent />
					</div>
				</div>

				<div className="flex gap-4 items-center flex-col sm:flex-row w-full"></div>
			</main>

			<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center py-20">
				<Link href="https://github.com/spidercodeur/cookies-consent">
					Github source{" "}
				</Link>
				|
				<CookiesLink text="Gestion des cookies" />
			</footer>
		</div>
	);
}
