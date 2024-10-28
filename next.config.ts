// next.config.js ou next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "img.youtube.com",
				pathname: "/**",
			},
		],
	},
	// Autres options de configuration ici
};

export default nextConfig;
