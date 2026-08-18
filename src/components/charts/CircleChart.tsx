import { ReactNode, RefObject, useRef } from "react";
import { Cell, Pie, PieChart, Tooltip, TooltipProps } from "recharts";
import {
	NameType,
	ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { useTheme } from "../../context.common/ThemeContext";

type PieChartTooltipProps = TooltipProps<ValueType, NameType> & {
	tooltipRef: RefObject<HTMLDivElement | null>;
};

function PieChartTooltip({
	active,
	payload,
	tooltipRef,
}: PieChartTooltipProps) {
	if (active && payload && payload.length && payload[0].name) {
		return (
			<div
				ref={tooltipRef}
				className="p-3.5 bg-grey-mid rounded-[0.1875rem] text-left"
			>
				<div className="flex items-center typo-pre-heading text-grey-light">
					<div
						className="w-2.5 h-2.5 mr-2 rounded-full"
						style={{ background: payload[0].payload.color }}
					></div>
					{payload[0].name}
				</div>
				<div className="mt-0.5 text-white">
					{(payload[0].value as number).toFixed(2)}
				</div>
			</div>
		);
	}
	return null;
}

type CircleChartProps = {
	data: {
		name: string;
		value: number;
		color: string;
	}[];
	label?: ReactNode;
	play?: boolean;
};

export const CircleChart = ({
	data,
	label,
	play = true,
	...props
}: CircleChartProps) => {
	const chartRef = useRef<PieChart>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);
	const [theme] = useTheme();

	return (
		<div
			className="relative flex justify-center text-center text-grey-light select-none"
			onMouseMove={(e) => {
				const rect = (chartRef.current as unknown as { container: HTMLElement }).container.getBoundingClientRect();
				if (tooltipRef.current) {
					tooltipRef.current.style.transform = `translate(${
						e.clientX - rect.left
					}px,${e.clientY - rect.top}px)`;
				}
			}}
			{...props}
		>
			{label && (
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90px]">
					{label}
				</div>
			)}
			<PieChart width={200} height={200} ref={chartRef}>
				<Pie
					isAnimationActive={false}
					dataKey="value"
					data={[{ value: 1 }]}
					innerRadius={80}
					outerRadius={97}
					stroke="none"
					fill={theme.useDarkTheme ? "#252627" : "#D4D4D4"}
				></Pie>
				<Pie
					animationDuration={1000}
					animationBegin={100}
					dataKey="value"
					data={data}
					startAngle={90}
					endAngle={play ? -450 : 90}
					innerRadius={80}
					outerRadius={97}
					stroke="none"
				>
					{data.map((entry, index) => {
						return (
							<Cell
								key={`cell-${index}`}
								fill={entry.color}
							></Cell>
						);
					})}
				</Pie>
				<Tooltip
					content={
						<PieChartTooltip
							tooltipRef={tooltipRef}
						/>
					}
					isAnimationActive={false}
					position={{ x: 0, y: 0 }}
					wrapperStyle={{ outline: "none" }}
				/>
			</PieChart>
		</div>
	);
};
