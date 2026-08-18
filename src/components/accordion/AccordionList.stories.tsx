import type { Meta, StoryObj } from "@storybook/react";
import { AccordionList } from "./AccordionList";

const meta: Meta<typeof AccordionList> = {
	title: "Components/AccordionList",
	component: AccordionList,
};

export default meta;

type Story = StoryObj<typeof meta>;

type ExampleObj = {
	desc: string;
	thing: string;
};

const listObj = () => {
	const list = [];

	for (let a = 0; a < 12; a++) {
		list.push({ desc: `Title ${a + 1}`, thing: "x".repeat(a + 1) });
	}

	return list;
};

const listAccContent = (i: ExampleObj) => {
	return <div>Accordion content - {i.thing}</div>;
};

const mockData = listObj();

export const List: Story = {
	args: {
		rowsPerPage: 5,
		summaryField: "desc",
		accordionData: mockData,
		accordionContent: listAccContent,
	},
};
