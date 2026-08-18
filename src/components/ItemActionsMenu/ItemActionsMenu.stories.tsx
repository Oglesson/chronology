import type { Meta, StoryObj } from "@storybook/react";
import Icons from "../../config.common/Icons";
import { ItemActionsMenu } from "./ItemActionsMenu";

const meta: Meta<typeof ItemActionsMenu> = {
	title: "Components/ItemActionsMenu",
	component: ItemActionsMenu,
	decorators: [
		(Story) => (
			<div className="flex justify-end">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof meta>;

const sampleActions = [
	{
		label: "Link example",
		url: "/example",
	},
	{
		label: "Method example",
		method: () => {
			alert("Button clicked");
		},
	},
	{
		step: (
			<button
				type="button"
				onClick={() => {
					alert("Step clicked");
				}}
			>
				Step example
			</button>
		),
	},
];

export const Default: Story = {
	args: {
		actions: sampleActions,
		buttonLabel: "More Actions",
	},
};

export const IconHorizontal: Story = {
	args: {
		actions: sampleActions,
		buttonIcon: Icons.Interface.MoreHorizontal,
		buttonLabel: "More Actions",
	},
};

export const StyleSelect: Story = {
	args: {
		actions: sampleActions,
		buttonIcon: Icons.Edit.Plus,
		buttonLabel: "Add a Question",
		style: "select",
	},
};
