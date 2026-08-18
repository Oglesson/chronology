export const useTranslation = () => ({
	t: (key: string, options?: { defaultValue?: string }) =>
		options?.defaultValue ?? key,
	i18n: {
		language: "en",
		changeLanguage: jest.fn(),
	},
});

export const Trans = ({ children }: { children: React.ReactNode }) => children;

export const initReactI18next = {
	type: "3rdParty",
	init: jest.fn(),
};
