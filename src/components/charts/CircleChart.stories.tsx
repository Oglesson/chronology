import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../common/button/Button";
import { PATH_COLORS } from "../../constants.common/path";
import { useToggle } from "../../hooks.common/useToggle";
import { CircleChart } from "./CircleChart";

const meta: Meta<typeof CircleChart> = {
	title: "Components/Charts/Circle Chart",
	component: CircleChart,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		data: [
			{ name: "VA", value: 1, color: "#00F3BB" },
			{ name: "NVA", value: 2, color: "#f94c40" },
		],
		label: "An example label",
	},
};

export const NoData: Story = {
	args: {
		data: [],
		label: "No Data",
	},
};

const RewindRender: Story["render"] = (args) => {
	const [play, setPlay] = useToggle(true);
	return (
		<div className="text-center">
			<CircleChart
				{...args}
				play={play}
				label={`Click below to ${play ? "Rewind" : "Play"}`}
			/>
			<div className="mt-10">
				<Button
					text={play ? "Rewind" : "Play"}
					style="secondary"
					onClick={() => {
						setPlay();
					}}
				/>
			</div>
		</div>
	);
};

export const Rewind: Story = {
	render: RewindRender,
	args: {
		data: [
			{ name: "VA", value: 1, color: "#00F3BB" },
			{ name: "NVA", value: 2, color: "#f94c40" },
		],
	},
};

export const OtherColours: Story = {
	args: {
		data: [
			{ name: "Purple", value: 1, color: PATH_COLORS[1] },
			{ name: "Blue", value: 1, color: PATH_COLORS[2] },
			{ name: "Green", value: 1, color: PATH_COLORS[3] },
			{ name: "Pink", value: 1, color: PATH_COLORS[4] },
			{ name: "Orange", value: 1, color: PATH_COLORS[5] },
			{ name: "Yellow", value: 1, color: PATH_COLORS[6] },
		],
		label: "Other Colours",
	},
};
