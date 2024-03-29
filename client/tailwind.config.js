module.exports = {
	purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
	},
	variants: {
		display: ["responsive", "group-hover"],
		extend: { borderWidth: ["last"] },
	},
	plugins: [require("@tailwindcss/forms")],
};
