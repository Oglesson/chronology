import { useArgs } from "@storybook/preview-api";
import type { Meta, StoryObj } from "@storybook/react";
import { Level } from "./Level";

const meta: Meta<typeof Level> = {
	title: "Components/Level",
	component: Level,
};

export default meta;

type Story = StoryObj<typeof meta>;

const DefaultRender: Story["render"] = (args) => {
	const [, updateArgs] = useArgs();

	const data = {
		callback: (value: number) => {
			updateArgs({ value: value });
		},
		min: 50,
		max: 125,
		steps: { 75: "Base", 100: "Standard" },
	};

	return <Level {...data} {...args} />;
};

export const Default: Story = {
	render: DefaultRender,
	args: {
		value: 75,
	},
	argTypes: {
		value: {
			control: {
				type: "range",
				min: 50,
				max: 125,
				step: 1,
			},
		},
	},
};
