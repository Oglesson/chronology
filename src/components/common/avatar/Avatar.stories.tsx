import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
	title: "Components/Avatar",
	component: Avatar,
	argTypes: {
		size: {
			control: {
				type: "select",
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		altText: "Blue shoe with orange laces",
		size: "lg",
		src: "https://freepngimg.com/thumb/categories/627.png",
	},
};

export const NoImage: Story = {
	args: {
		altText: "",
		size: "lg",
		src: "",
	},
};
