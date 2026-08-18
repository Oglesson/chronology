import type { Meta, StoryObj } from "@storybook/react";
import Icons from "../../../config.common/Icons";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
	title: "Components/Button",
	component: Button,
	argTypes: {
		icon: {
			control: {
				type: "select",
			},
			options: ["Filter", "Back arrow", "Plus", "Pencil"],
			mapping: {
				Filter: Icons.Interface.Filter,
				"Back arrow": Icons.Interface.ArrowBack,
				Plus: Icons.Edit.Plus,
				Pencil: Icons.Edit.Pencil,
			},
		},
		style: {
			table: {
				disable: true,
			},
		},
		theme: {
			control: {
				type: "select",
				labels: {
					default: "Default",
					decline: "Decline",
				},
			},
			options: ["default", "decline"],
		},
		type: {
			table: {
				disable: true,
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		style: "primary",
		text: "Label Here",
	},
	argTypes: {
		...meta.argTypes,
		icon: {
			table: {
				disable: true,
			},
		},
	},
};

export const PrimaryDecline: Story = {
	args: {
		style: "primary",
		text: "Label Here",
		theme: "decline",
	},
	argTypes: {
		...meta.argTypes,
		icon: {
			table: {
				disable: true,
			},
		},
	},
};

export const Secondary: Story = {
	args: {
		icon: Icons.Edit.Plus,
		style: "secondary",
		text: "Label Here",
	},
};

export const Tertiary: Story = {
	args: {
		icon: Icons.Edit.PlusSmall,
		style: "tertiary",
		text: "Add",
	},
};
