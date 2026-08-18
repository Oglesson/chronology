import {
	Auth0Context,
	type Auth0ContextInterface,
	type User,
} from "@auth0/auth0-react";
import { useParameter, useState } from "storybook/preview-api";
import { type StoryContext } from "@storybook/react";
import React from "react";
import { defaultAuth0State, PARAM_KEY } from "./constants";

// eslint-disable-next-line react-refresh/only-export-components
const Auth0Decorator = ({ Story }: { Story: React.FC<unknown> }) => {
	const initalAuth0State = useParameter(PARAM_KEY, { ...defaultAuth0State });
	const [auth0State] = useState(
		initalAuth0State as unknown as Auth0ContextInterface<User>,
	);

	return (
		<Auth0Context.Provider value={auth0State}>
			<Story />
		</Auth0Context.Provider>
	);
};

export const withAuth0 = (Story: React.FC<unknown>, _context: StoryContext) => (
	<Auth0Decorator Story={Story} />
);
