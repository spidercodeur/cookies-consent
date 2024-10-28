import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import ClientCookieProvider from "@/app/components/ClientCookieProvider";
import { CookiesProvider } from "@/app/context/CookiesContext";
import CookieBanner from "./components/CookieBanner";
const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-100 text-slate-900`}
			>
				<CookiesProvider>
					<ClientCookieProvider>
						{children}
						<CookieBanner />
					</ClientCookieProvider>
				</CookiesProvider>
			</body>
		</html>
	);
}
