import Image from "next/image";
import LinkCookies from "./components/CookiesLink";
import AnalyticsComponent from "./components/AnalyticsComponent";
import YoutubeComponent from "./components/YoutubeComponent";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Démo intégration de Cookies consentement avec Nextjs RGPD",
	description:
		"Intégration de Cookies consentement avec Nextjs RGPD, avec gestion des services",
};

// Composant pour les liens du footer
const FooterLink = ({
	href,
	icon,
	text,
}: {
	href: string;
	icon: string;
	text: string;
}) => (
	<a
		className="flex items-center gap-2 hover:underline hover:underline-offset-4"
		href={href}
		target="_blank"
		rel="noopener noreferrer"
	>
		<Image
			aria-hidden
			src={icon}
			alt={`${text} icon`}
			width={16}
			height={16}
		/>
		{text}
	</a>
);

// Composant pour les exemples de code
const CodeExample = ({ title, code }: { title: string; code: string }) => (
	<div className="mt-6">
		<b>{title}</b>
		<pre className="text-sm bg-slate-200 p-3 mb-4 w-fit">
			<code>{code}</code>
		</pre>
	</div>
);

export default function Home() {
	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
				<div className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)] w-90">
					<p className="text-lg">Démo intégration</p>
					<h1 className="text-3xl font-bold">
						Gestion cookies avec{" "}
						<Image
							className="dark:invert"
							src="/next.svg"
							alt="Next.js logo"
							width={180}
							height={38}
							priority
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
					<LinkCookies
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

			<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
				<FooterLink
					href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					icon="/file.svg"
					text="Learn"
				/>
				<FooterLink
					href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					icon="/window.svg"
					text="Examples"
				/>
				<FooterLink
					href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					icon="/globe.svg"
					text="Go to nextjs.org →"
				/>
				<LinkCookies text="Gestion des cookies" />
			</footer>
		</div>
	);
}
