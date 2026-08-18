import type { Meta, StoryObj } from "@storybook/react";
import { Account } from "./Account";

const meta: Meta<typeof Account> = {
	title: "Navigation/Account",
	component: Account,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	parameters: {
		auth0React: {
			isAuthenticated: true,
			user: {
				name: "Tom Gaskill",
				picture:
					"https://s.gravatar.com/avatar/6b49d300f3403ac07913790a7f1bb7e3?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fto.png",
			},
		},
	},
};
