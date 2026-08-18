import { themes } from "@storybook/theming";
import Icons from "../src/config.common/Icons";
// import { DocsContainer } from "./DocsContainer";
import { globalDecorators } from "./decorators";

import "./main.scss";

export const decorators = globalDecorators;

export const globalTypes = {
	locale: {
		name: "Locale",
		description: "Internationalization locale",
		toolbar: {
			icon: "globe",
			items: [
				{ value: "en", title: "English" },
				{ value: "zh", title: "Chinese" },
				{ value: "vi", title: "Vietnamese" },
			],
			title: "Language",
		},
	},
};

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	darkMode: {
		current: "dark",
		dark: {
			...themes.dark,
			brandTitle: "Chronology",
			brandImage: Icons.Logo.ChronologyWhite.path,
		},
		light: {
			...themes.light,
			brandTitle: "Chronology",
			brandImage: Icons.Logo.ChronologyBlack.path,
		},
		stylePreview: true,
	},
	// docs: {
	// 	container: DocsContainer,
	// },
};
