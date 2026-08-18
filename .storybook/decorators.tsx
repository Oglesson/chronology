import { Suspense, useEffect, type FC } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../src/i18n";
import { withRouter } from "storybook-addon-react-router-v6";
import { withAuth0 } from "../src/plugins.common/storybook/auth0/withAuth0";
import { NotificationProvider } from "../src/context.common/NotificationContext";
import { type StoryContext } from "@storybook/react";

// initialize();

// eslint-disable-next-line react-refresh/only-export-components
const I18nextDecorator = ({ Story, locale }: { Story: FC<unknown>; locale: string }) => {
	useEffect(() => {
		i18n.changeLanguage(locale);
	}, [locale]);

	return (
		<Suspense fallback={<div>loading translations...</div>}>
			<I18nextProvider i18n={i18n}>
				<NotificationProvider>
					<Story />
				</NotificationProvider>
			</I18nextProvider>
		</Suspense>
	);
};

const withI18next = (Story: FC<unknown>, context: StoryContext) => (
	<I18nextDecorator Story={Story} locale={context.globals.locale} />
);

export const globalDecorators = [withI18next, withRouter, withAuth0];
