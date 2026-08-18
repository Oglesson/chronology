import type { Meta, StoryObj } from "@storybook/react";
import { PATH_COLORS } from "../../constants.common/path";
import { BarChart } from "./BarChart";

const meta: Meta<typeof BarChart> = {
	title: "Components/Charts/Bar Chart",
	component: BarChart,
	decorators: [
		(Story) => (
			<div className="max-w-[1050px]">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		colors: ["#00F3BB"],
		data: [
			{ name: "Cutting24", values: [40] },
			{ name: "Cutting25", values: [30] },
			{ name: "Cut26", values: [20] },
			{ name: "Cut28", values: [27] },
			{ name: "Cutting29", values: [18] },
			{ name: "Cut30", values: [23] },
			{ name: "Cutting21", values: [34] },
			{ name: "Cut32", values: [23] },
		],
		height: 400,
		labels: ["VA"],
		totalHeading: "AMS",
	},
};

export const Stacked: Story = {
	args: {
		colors: ["#00F3BB", "#063D2F"],
		data: [
			{ name: "Cutting24", values: [40, 24] },
			{ name: "Cutting25", values: [30, 13] },
			{ name: "Cut26", values: [20, 98] },
			{ name: "Cut28", values: [27, 39] },
			{ name: "Cutting29", values: [18, 48] },
			{ name: "Cut30", values: [23, 38] },
			{ name: "Cutting21", values: [34, 43] },
			{ name: "Cut32", values: [23, 30] },
		],
		height: 400,
		labels: ["VA", "NVA"],
		totalHeading: "AMS",
	},
};

export const OtherColours: Story = {
	args: {
		colors: [
			PATH_COLORS[1],
			PATH_COLORS[2],
			PATH_COLORS[3],
			PATH_COLORS[4],
			PATH_COLORS[5],
			PATH_COLORS[6],
		],
		data: [
			{ name: "Cutting24", values: [40, 24, 21, 8, 19, 5] },
			{ name: "Cutting25", values: [30, 13, 15, 21, 18, 9] },
			{ name: "Cut26", values: [20, 98, 3, 12, 19, 20] },
			{ name: "Cut28", values: [27, 39, 10, 15, 4, 9] },
			{ name: "Cutting29", values: [18, 48, 12, 4, 19, 30] },
			{ name: "Cut30", values: [23, 38, 10, 23, 14, 35] },
			{ name: "Cutting21", values: [34, 43, 10, 15, 22, 30] },
			{ name: "Cut32", values: [23, 30, 7, 14, 13, 26] },
		],
		height: 400,
		labels: ["Purple", "Blue", "Green", "Pink", "Orange", "Yellow"],
	},
};
