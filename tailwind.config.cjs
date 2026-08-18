/** @type {import('tailwindcss').Config} */

const {
	FontSizes,
	font,
	rem,
} = require("./src/plugins.common/tailwind/font.plugin.cjs");

module.exports = {
	content: [
		"./index.html",
		"./storybook/**/*.{scss,js,ts,jsx,tsx}",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	corePlugins: { fontSize: false }, // Enable to use custom font sizes plugin
	darkMode: "class",
	plugins: [
		// require("@tailwindcss/aspect-ratio"),
		require("@tailwindcss/forms")({ strategy: "class" }),
		FontSizes,
		function ({ addUtilities }) {
			addUtilities({
				".scrollbar-hide": {
					"scrollbar-width": "none",
					"-ms-overflow-style": "none",
					"&::-webkit-scrollbar": { display: "none" },
				},
			});
		},
	],
	theme: {
		colors: {
			background: "#0f0e0f",
			"black-subtle": "#191a1b",
			black: "#252627",
			current: "currentColor",
			"grey-mid": "#353535",
			"grey-light": "#a0a0a0",
			"grey-lighter": "#D4D4D4",
			"grey-lightest": "#F5F5F5",
			white: "#fff",
			green: "#8b5cf6",
			"green-dark": "#1e0a3c",
			"green-mid": "#5b21b6",
			"green-light": "#ede9fe",
			"in-progress": "#ffbf00",
			costing: "#936dff",
			decline: "#f94c40",
			complete: "#2dca89",
			todo: "#c57cff",
			transparent: "transparent",
			"true-black": "#000",
			"chart-purple": "#936DFF",
			"chart-blue": "#0D99FF",
			"chart-pink": "#FFC7C2",
			"chart-orange": "#F97932",
			"chart-yellow": "#FACC15",
		},
		fontFamily: {
			sans: ["Poltab", "Helvetica", "acumin-pro", "Arial", "sans-serif"],
			mono: ["mono45-headline", "monospace"],
		},
		fontSize: {
			"account-name": {
				base: font(21, 24, 0),
			},
			body: {
				base: font(16, 20, 0),
			},
			button: {
				base: font(14, 12, 0),
			},
			"button-tertiary": {
				base: font(14, 14, 0),
			},
			copyright: {
				base: font(13, 13, 0),
			},
			h1: {
				base: font(60, 64, -1.5),
			},
			h2: {
				base: font(48, 50, -0.5),
			},
			h3: {
				base: font(32, 38, -0.5),
			},
			h4: {
				base: font(24, 28, -0.2),
			},
			h5: {
				base: font(18, 22, 0),
			},
			large: {
				base: font(96, 100, -3),
			},
			actions: {
				base: font(14, 16, 0),
			},
			"pre-heading": {
				base: font(14, 16, 1),
			},
			pullout: {
				base: font(120, 86, -4),
			},
			status: {
				base: font(12, 13, 0),
			},
			validation: {
				base: font(14, 18, 0),
			},
		},
		transitionTimingFunction: {
			DEFAULT: "ease",
			custom: "cubic-bezier(0.6, 0, 0.2, 1)",
			slide: "cubic-bezier(0.4, 0, 0, 1)",
			opacity: "cubic-bezier(0.37, 0.12, 0.49, 1)",
			spin: "cubic-bezier(0.5, 0.1, 0.25, 1)",
			toggle: "cubix-beszier(.0.95, 0.2, 0.25, 1)",
			hover: "cubic-bezier(0.38, 0, 0.21, 1)",
		},
		extend: {
			backgroundImage: {
				"gradient-dark":
					"linear-gradient(240deg, #8b5cf6 -70%, #0f0e0f 42%)",
				"gradient-light":
					"linear-gradient(240deg, #8b5cf6 -70%, #fff 42%)",
				"dashed-light": `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='0.375rem' ry='0.375rem' stroke='%23a0a0a0' stroke-width='2' stroke-dasharray='8 5' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
				"dashed-dark": `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='0.375rem' ry='0.375rem' stroke='%23353535' stroke-width='2' stroke-dasharray='8 5' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
			},
			backgroundOpacity: {
				15: "0.15",
			},
			boxShadow: {
				actions: "0 10px 60px rgba(0, 0, 0, 0.5)",
			},
			gap: {
				4.75: rem(19),
			},
			height: {
				3.5: rem(14),
				23: rem(92),
			},
			margin: {
				3.5: rem(14),
				4.5: rem(18),
				4.75: rem(19),
				6.5: rem(26),
				15: rem(60),
			},
			padding: {
				1.75: rem(7),
				2.25: rem(9),
				2.5: rem(10),
				2.75: rem(11),
				3.5: rem(14),
				3.75: rem(15),
				4.25: rem(17),
				4.5: rem(18),
				4.75: rem(19),
				6.5: rem(26),
				10.5: rem(42),
				35: rem(140),
			},
			space: {
				4.75: rem(19),
			},
			translate: {
				"5/12": `${(5 / 12) * 100}%`,
			},
			width: {
				3.5: rem(14),
				11.25: rem(45),
				23: rem(92),
				110: rem(440),
			},
			keyframes: {
				pop: {
					"0%": {
						transform: "scale(1)",
					},
					"100%": {
						transform: "scale(1.05)",
					},
				},
			},
			animation: {
				pop: "pop 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22) forwards",
				"spin-slow": "spin 2s linear infinite",
			},
			transitionDuration: {
				0: "0ms",
			},
			zIndex: {
				100: 100,
			},
			aspectRatio: {
				"6/4": "6 / 4",
			},
		},
	},
};
