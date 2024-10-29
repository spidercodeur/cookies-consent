export const INITIAL_PREFERENCES = {
	essential: [{ id: 0, name: "Core", enabled: true }],
	analytics: [{ id: 1, name: "Google Analytics", enabled: false }],
	marketing: [
		{ id: 2, name: "Facebook", enabled: false },
		{ id: 3, name: "Typeform | VideoAsk", enabled: false },
	],
	functional: [
		{ id: 4, name: "YouTube", enabled: false },
		{ id: 5, name: "Google maps", enabled: false },
	],
} as const;
