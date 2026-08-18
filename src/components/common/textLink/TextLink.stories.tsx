import type { Meta, StoryObj } from "@storybook/react";
import { TextLink } from "./TextLink";

const meta: Meta<typeof TextLink> = {
	title: "Components/TextLink",
	component: TextLink,
	args: {
		to: "#",
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Link: Story = {
	args: {
		text: "I am a text link",
	},
};
