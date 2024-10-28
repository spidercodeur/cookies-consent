export const DEFAULT_PREFERENCES = {
	essential: [{ id: 0, name: "Core", enabled: true }],
	analytics: [{ id: 1, name: "Google Analytics", enabled: false }],
	marketing: [{ id: 2, name: "Facebook Pixel", enabled: false }],
	functional: [
		{ id: 3, name: "YouTube", enabled: false },
		{ id: 4, name: "Facebook", enabled: false },
	],
} as const;
