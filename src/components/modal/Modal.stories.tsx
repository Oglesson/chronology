import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
	title: "Components/Modal",
	component: Modal,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		children: <div>Hello</div>,
		isOpen: true,
	},
};
