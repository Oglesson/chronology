/** @type {import('jest').Config} */
module.exports = {
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
	moduleNameMapper: {
		"\\.(scss|css|sass)$": "identity-obj-proxy",
		"\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp)$":
			"<rootDir>/src/test/__mocks__/fileMock.cjs",
		"^react-i18next$": "<rootDir>/src/test/__mocks__/react-i18next.ts",
	},
	transform: {
		"^.+\\.tsx?$": [
			"ts-jest",
			{
				tsconfig: {
					module: "CommonJS",
					jsx: "react-jsx",
				},
				diagnostics: false,
			},
		],
	},
	testMatch: ["**/*.test.tsx", "**/*.test.ts"],
};
