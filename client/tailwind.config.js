import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,jsx,ts,tsx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					500: "#F234B2"
				}
			},

			keyframes: {
				fadeIn: {
					"0%": { opacity: 0 },
					"100%": { opacity: 1 },
				},
				fadeInOut: {
					"0%": {
						top: "20%",
						opacity: 0,
						transform: "scale(80%)",
					},
					"50%": {
						top: "-30%",
						opacity: 1,
						transform: "scale(110%)",
					},
					"100%": {
						top: "-60%",
						opacity: 0,
						transform: "scale(100%)",
					},
				}
			},
			animation: {
				fadeIn: "fadeIn 0.4s ease-in-out 0.2s forwards",
				fadeInOut: "fadeInOut 2s ease-in-out",
			},
			fontSize: {
				clamp: "clamp(2.5rem, 3vw, 3.75rem)",
			},
			boxShadow: {
				up: "0 -25px 40px 40px rgba(0 0 0 / 0.95)",
				down: "0 25px -40px 40px rgba(0 0 0 / 0.95)",
			},
			backgroundImage: {
				"main-gradient": "linear-gradient(90deg, #BB38DC 0%, #FF00BF 100%)",
				"main-gradient-2": "linear-gradient(135deg, #C334DB 0%, #FA06C3 100%)",
			},
			backgroundColor: {
				"main-gradient": "linear-gradient(135deg, #C334DB 0%, #FA06C3 100%)",
				"main-gradient-2": "linear-gradient(135deg, #C334DB 0%, #FA06C3 100%)",
				"primary-grey": "#131313",
				"secondary-grey": "#FFFFFF14",
			},
			fontFamily: {
				kanit: ["Kanit", "sans-serif"],
			},
			borderColor: {
				"transparent-gradient": "rgba(255, 255, 255, 0.22)",
			},
		},
		screens: {
			xs: "330px",

			sm: "640px",
			// => @media (min-width: 640px) { ... }

			md: "768px",
			// => @media (min-width: 768px) { ... }

			lg: "1024px",
			// => @media (min-width: 1024px) { ... }

			xl: "1280px",
			// => @media (min-width: 1280px) { ... }

			"2xl": "1536px",
			// => @media (min-width: 1536px) { ... }
		},
	},
	darkMode: "class",
	plugins: [
		nextui(),
		function ({ addUtilities, theme, e }) {
			const newUtilities = {};

			const backdropBlurValues = theme('backdropBlur');

			for (const key in backdropBlurValues) {
				const value = backdropBlurValues[key];
				newUtilities[`.${e(`backdrop-blur-${key}`)}`] = {
					'backdrop-filter': `blur(${value})`,
					'-webkit-backdrop-filter': `blur(${value})`,
				};
			}

			addUtilities(newUtilities, ['responsive', 'hover']);
		}
	],
};
