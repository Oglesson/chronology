import type { Meta, StoryObj } from "@storybook/react";
import Icons from "../../../config.common/Icons";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
	title: "Components/Tooltip",
	component: Tooltip,
	argTypes: {
		content: {
			control: {
				type: "text",
			},
		},
		open: {
			control: {
				type: "boolean",
			},
		},
		placement: {
			control: {
				type: "select",
			},
		},
		theme: {
			control: {
				type: "select",
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<div className="flex m-32 items-center justify-center">
			<Tooltip {...args}>
				<RenderIcon icon={Icons.Interface.Info} />
				<span className="sr-only">Info</span>
			</Tooltip>
		</div>
	),
	args: {
		content: "I am a tooltip example",
		placement: "top",
	},
};

export const Themed: Story = {
	render: (args) => (
		<div className="flex gap-x-5 m-32 items-center justify-center">
			<Tooltip
				{...args}
				content="This is Valid!"
				placement="left"
				theme="success"
			>
				<RenderIcon icon={Icons.Interface.Check} />
				<span className="sr-only">Valid</span>
			</Tooltip>
			<Tooltip
				{...args}
				content="This is a Warning!"
				placement="top"
				theme="warning"
			>
				<RenderIcon icon={Icons.Interface.Help} />
				<span className="sr-only">Warning</span>
			</Tooltip>
			<Tooltip
				{...args}
				content="This is an Error!"
				placement="right"
				theme="error"
			>
				<RenderIcon icon={Icons.Interface.Info} />
				<span className="sr-only">Error</span>
			</Tooltip>
		</div>
	),
	args: {},
};

export const HTML: Story = {
	render: (args) => (
		<div className="flex m-32 items-center justify-center">
			<Tooltip {...args}>
				<RenderIcon icon={Icons.Interface.Help} />
				<span className="sr-only">Info</span>
			</Tooltip>
		</div>
	),
	args: {
		content: (
			<>
				I am a tooltip with a{" "}
				<a className="underline" href="#" target="_blank">
					Link
				</a>
			</>
		),
		placement: "top",
	},
};
