import { Fragment, useEffect, useRef, useState } from "react";
import { PointData } from "../../../api.common/types";

type Coordinate = {
	x: number;
	y: number;
};

type Bounds = {
	top: number;
	right: number;
	bottom: number;
	left: number;
	height: number;
	width: number;
};

type PathPreviewProps = {
	path: PointData[];
};

export const PathPreview = ({ path }: PathPreviewProps) => {
	const [bounds, setBounds] = useState<Bounds>();
	const transform = useRef([1, 0, 0, 1, 0, 0]);
	const svgRef = useRef<SVGSVGElement>(null);
	const groupRef = useRef<SVGGElement>(null);

	const getBounds = () => {
		return path.reduce(
			(a, c): Bounds => {
				const { X: x, Y: y } = c;
				const top = !a.top || y < a.top ? y : a.top;
				const right = !a.right || x > a.right ? x : a.right;
				const bottom = !a.bottom || y > a.bottom ? y : a.bottom;
				const left = !a.left || x < a.left ? x : a.left;
				const width = right - left;
				const height = bottom - top;

				return {
					top: top,
					right: right,
					bottom: bottom,
					left: left,
					width: width,
					height: height,
				};
			},
			{
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				height: 0,
				width: 0,
			}
		);
	};

	const getNormalisedCoordinate = (point: PointData, bounds: Bounds) => {
		if (!point) {
			return {
				x: undefined,
				y: undefined,
			};
		}
		return {
			x: point.X - bounds.left,
			y: bounds.height - point.Y + bounds.top,
		};
	};

	const handleZoom = (scale: number) => {
		if (!bounds) {
			return;
		}
		const zoomLevel = scale;
		const xFocus = bounds.width * 0.5;
		const yFocus = bounds.height * 0.5;
		const xOrigin =
			(-transform.current[4] + xFocus) /
			(bounds.width * transform.current[0]);
		const yOrigin =
			(-transform.current[5] + yFocus) /
			(bounds.height * transform.current[0]);

		transform.current[0] = zoomLevel;
		transform.current[3] = zoomLevel;
		transform.current[4] = -(bounds.width * zoomLevel * xOrigin) + xFocus;
		transform.current[5] = -(bounds.height * zoomLevel * yOrigin) + yFocus;

		groupRef.current!.style.transform = `matrix(${transform.current.join(
			","
		)})`;
	};

	useEffect(() => {
		transform.current = [1, 0, 0, 1, 0, 0];
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setBounds(getBounds());
	}, [path]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (bounds) {
			handleZoom(
				Math.min(
					bounds.width / (bounds.right - bounds.left),
					bounds.height / (bounds.bottom - bounds.top)
				) - 0.2
			);
		}
	}, [bounds]); // eslint-disable-line react-hooks/exhaustive-deps

	if (!path.length || !bounds) {
		return <></>;
	}

	return (
		<>
			<svg
				className="aspect-6/4"
				ref={svgRef}
				viewBox={`0 0 ${bounds.width} ${bounds.height}`}
			>
				<g ref={groupRef}>
					{path.map((point, index) => {
						const { x, y } = getNormalisedCoordinate(
							point,
							bounds
						) as Coordinate;

						const { x: nextX, y: nextY } = getNormalisedCoordinate(
							path[index + 1],
							bounds
						);

						return (
							<Fragment key={`${x},${y}`}>
								{path[index + 1] &&
									path[index + 1]?.PointType !==
										"ptNewPath" && (
										<line
											key={`${x},${y}`}
											x1={x}
											y1={y}
											x2={nextX}
											y2={nextY}
											stroke="#000"
											strokeWidth={1}
											vectorEffect="non-scaling-stroke"
										/>
									)}
							</Fragment>
						);
					})}
				</g>
			</svg>
		</>
	);
};
