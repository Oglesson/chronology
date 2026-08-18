import { RefObject, useRef, useState } from "react";
import {
	Bar,
	BarChart as Chart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Tooltip,
	TooltipProps,
	XAxis,
	YAxis,
} from "recharts";
import {
	NameType,
	ValueType,
} from "recharts/types/component/DefaultTooltipContent";

type BarChartTooltipProps = TooltipProps<ValueType, NameType> & {
	tooltipRef: RefObject<HTMLDivElement | null>;
	colors: string[];
	labels: string[];
	totalHeading: string;
};

function BarChartTooltip({
	active,
	payload,
	tooltipRef,
	colors,
	labels,
	totalHeading,
}: BarChartTooltipProps) {
	if (active && payload && payload.length && payload[0].name) {
		return (
			<div
				ref={tooltipRef}
				className="p-8 w-96 max-w-full bg-black rounded-md text-left"
			>
				<h4 className="typo-h4">{payload[0].payload.name}</h4>
				<div className="grid-container mt-8 mb-7">
					{payload[0].payload.values.map(
						(value: number, index: number) => (
							<div key={index} className="col-span-6">
								<div className="flex items-center typo-pre-heading text-grey-light">
									<div
										className="w-2.5 h-2.5 mr-2 rounded-full"
										style={{ background: colors[index] }}
									></div>
									{labels[index]}
								</div>
								<div className="mt-0.5 text-white">
									{value.toFixed(2)}
								</div>
							</div>
						)
					)}
				</div>
				{totalHeading && <h4 className="typo-h4">AMS</h4>}
				<p className="typo-h2 mt-1.5">
					{payload[0].payload.values
						.reduce((a: number, b: number) => a + b, 0)
						.toFixed(2)}
				</p>
			</div>
		);
	}
	return null;
}

type BarChartProps = {
	colors: string[];
	data: {
		name: string;
		values: number[];
	}[];
	height: number;
	labels: string[];
	totalHeading: string;
};

export const BarChart = ({
	colors,
	data,
	height,
	labels,
	totalHeading,
	...props
}: BarChartProps) => {
	const tooltipRef = useRef<HTMLDivElement>(null);

	const maxValue = data.reduce(
		(max, item) => Math.max(max, item.values.reduce((a, b) => a + b, 0)),
		0
	);
	const startData = data.map((item) => ({
		...item,
		values: item.values.map(() => 0),
	}));
	const [prevData, setPrevData] = useState(data);
	const [chartData, setChartData] = useState(startData);
	const [animationActive, setAnimationActive] = useState(false);
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	if (prevData !== data) {
		setPrevData(data);
		if (animationActive) {
			setChartData(data);
		}
	}

	return (
		<div
			className="select-none text-pre-heading [&_.xAxis]:font-mono"
			{...props}
		>
			<ResponsiveContainer width="100%" height={height}>
				<Chart
					data={chartData}
					barCategoryGap="11%"
					margin={{
						top: 10,
						right: 0,
						left: 0,
						bottom: 20,
					}}
					onMouseMove={(state) => {
						if (state.isTooltipActive) {
							setActiveIndex(state.activeTooltipIndex as number);
						} else {
							setActiveIndex(null);
						}
					}}
					onMouseLeave={() => {
						setActiveIndex(null);
					}}
				>
					<CartesianGrid stroke="#353535" vertical={false} />
					<XAxis
						axisLine={false}
						dataKey="name"
						dy={20}
						padding={{ left: 10, right: 10 }}
						stroke="#A0A0A0"
						tickLine={false}
					/>
					<YAxis
						axisLine={false}
						domain={[0, Math.ceil(maxValue)]}
						minTickGap={0}
						stroke="#A0A0A0"
						tickLine={false}
						tickFormatter={(value) => value.toFixed(2)}
						ticks={[...Array(5)].map((_, index) => {
							return (Math.ceil(maxValue) / 4) * index;
						})}
					/>
					<Tooltip
						content={
							<BarChartTooltip
								tooltipRef={tooltipRef}
								colors={colors}
								labels={labels}
								totalHeading={totalHeading}
							/>
						}
						isAnimationActive={false}
						wrapperStyle={{ outline: "none" }}
						cursor={false}
					/>
					{colors.map((color, colorIndex) => (
						<Bar
							key={`cell-${colorIndex}`}
							dataKey={(v) => v.values[colorIndex]}
							stackId="a"
							animationDuration={animationActive ? 600 : 0}
							animationBegin={0}
							onAnimationEnd={() => {
								setAnimationActive(true);
								setChartData(data);
							}}
						>
							{chartData.map((entry, entryIndex) => {
								return (
									<Cell
										key={`cell-${colorIndex}-${entryIndex}`}
										fill={color}
										opacity={
											activeIndex == undefined ||
											entryIndex == activeIndex
												? 1
												: 0.3
										}
										className="transition-opacity"
									></Cell>
								);
							})}
						</Bar>
					))}
				</Chart>
			</ResponsiveContainer>
		</div>
	);
};
