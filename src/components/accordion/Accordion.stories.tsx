import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./Accordion";

const meta: Meta<typeof Accordion> = {
	title: "Components/Accordion",
	component: Accordion,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		summary: "Accordion Heading",
		children: (
			<div>
				<h5 className="typo-h5">Sub heading</h5>
				<p className="mt-5">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
					faucibus metus quis tortor lacinia fringilla. Nulla aliquet, ex
					sed interdum tempor, mi eros auctor tortor, a luctus est est
					quis mauris.
				</p>
				<p className="mt-5">
					Fusce gravida eu velit nec facilisis. Donec rhoncus, urna
					volutpat facilisis bibendum, dui ipsum egestas ipsum, eu dictum
					neque dolor eu est. Aliquam ornare commodo ante vel porttitor.
					Nullam quis lacinia ex. Pellentesque quam ante, congue eu mauris
					sed, faucibus bibendum dolor. Cras laoreet commodo luctus.
					Nullam pretium odio justo, a ultrices dolor volutpat quis. Proin
					eleifend elementum justo, sit amet cursus nibh mollis a. Nunc
					molestie mollis sem non vulputate. Duis rhoncus tellus et mauris
					fringilla, nec consectetur nisl viverra.
				</p>
			</div>
		),
	},
};
