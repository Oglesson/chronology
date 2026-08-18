import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PathTypes, PointData } from "../../../api.common/types";
import Icons from "../../../config.common/Icons";
import useEventListener from "../../../hooks.common/useEventListener";
import { PATH_COLORS } from "../../../constants.common/path";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import { EditPathFeature } from "./_EditPathFeature";
import { useToggle } from "../../../hooks.common/useToggle";
import { useProcess } from "../../../hooks.queries/useProcess";
import { useQuestionsContext } from "../../../hooks.queries/useQuestionsContext";
import { useProcessDefinition } from "../../../hooks.queries/useProcessDefinition";

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

type PathCanvasProps = object;

export const PathCanvas = (_: PathCanvasProps) => {
	const {
		previewMode,
		availablePaths,
		pathsQuestionsState,
		setPathsQuestionsState,
	} = useQuestionsContext();

	const [zoom, setZoom] = useState<number>(1);
	const [bounds, setBounds] = useState<Bounds>();
	const [isAnimated, setIsAnimated] = useState<boolean>(false);
	const [startIndex, setStartIndex] = useState<number | null>(null);
	const [endIndex, setEndIndex] = useState<number | null>(null);
	const [hoverIndex, setHoverIndex] = useState<number | null>(null);
	const [pathType, setPathType] = useState<PathTypes | null>(null);
	const [pathBounds, setPathBounds] = useState<{
		startIndex: number;
		endIndex: number;
	} | null>(null);
	const [openModal, setOpenModal] = useToggle(false);
	const [keyIsOpen, setKeyIsOpen] = useToggle(true);
	const [initialZoomValue, setInitialZoomValue] = useState<number>(1);
	const transform = useRef([1, 0, 0, 1, 0, 0]);
	const startPosition = useRef<Coordinate | undefined>();
	const isDragging = useRef<boolean>(false);
	const initialZoom = useRef<number>(1);
	const svgRef = useRef<SVGSVGElement>(null);
	const groupRef = useRef<SVGGElement>(null);
	const { t } = useTranslation();

	const definition = useProcessDefinition();
	const process = useProcess();

	const allowedPathTypes = previewMode
		? definition?.Pathtypes
		: process?.FullTaskDefinition?.AllowedPathTypes;

	const screenToSVG = (x: number, y: number) => {
		const p = svgRef.current!.createSVGPoint();
		p.x = x;
		p.y = y;
		return p.matrixTransform(svgRef.current!.getScreenCTM()!.inverse());
	};

	const handleMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
		event.preventDefault();

		setIsAnimated(false);

		const { x, y } = screenToSVG(event.clientX, event.clientY);

		startPosition.current = {
			x: x - transform.current[4],
			y: y - transform.current[5],
		};
	};

	const handlePan = (dx: number, dy: number) => {
		transform.current[4] = dx;
		transform.current[5] = dy;

		groupRef.current!.style.transform = `matrix(${transform.current.join(
			","
		)})`;
	};

	const handleZoom = (scale: number) => {
		if (!bounds) {
			return;
		}
		const zoomLevel = Math.max(scale, initialZoom.current);
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

		setZoom(zoomLevel);
	};

	useEventListener(
		"mousemove",
		(event) => {
			if (!startPosition.current) {
				return;
			}
			if (!isDragging.current) {
				setHoverIndex(null);
				isDragging.current = true;
				svgRef.current?.classList.add("cursor-grabbing");
				groupRef.current?.classList.add("pointer-events-none");
			}

			const { x, y } = screenToSVG(
				(event as MouseEvent).clientX,
				(event as MouseEvent).clientY
			);

			handlePan(x - startPosition.current.x, y - startPosition.current.y);
		},

		document
	);

	useEventListener(
		"mouseup",
		(_event) => {
			if (!startPosition.current) {
				return;
			}
			setIsAnimated(true);
			isDragging.current = false;
			startPosition.current = undefined;
			svgRef.current?.classList.remove("cursor-grabbing");
			groupRef.current?.classList.remove("pointer-events-none");
		},
		document
	);

	const getBounds = () => {
		return pathsQuestionsState.value.reduce(
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

	const getLineAngle = (p1: Coordinate, p2: Coordinate) => {
		return (Math.atan2(p2.x - p1.x, p2.y - p1.y) * 180) / Math.PI;
	};

	const getPathBounds = (index: number, path: PointData[]) => {
		const points = path.map((point) => point.PointType);
		const startIndex = points.lastIndexOf("ptNewPath", index);
		const endIndex = points.indexOf("ptNewPath", index + 1);

		return {
			startIndex: startIndex,
			endIndex: (endIndex === -1 ? points.length : endIndex) - 1,
		};
	};



	useEffect(() => {
		if (startIndex !== null && endIndex !== null && pathType) {
			setPathsQuestionsState((previous) => {
				const next =
					structuredClone?.(previous) ||
					JSON.parse(JSON.stringify(previous));
				const start = Math.min(startIndex, endIndex);
				const end = Math.max(startIndex, endIndex);

				for (let i = start; i < end; i++) {
					if (i > start && next.value[i].PointType === "ptNewPath") {
						return previous;
					}
					next.value[i].PathType = pathType;
				}

				return next;
			});

			// eslint-disable-next-line react-hooks/set-state-in-effect
			setStartIndex(null);
			setEndIndex(null);
		}
	}, [endIndex, pathType, setPathsQuestionsState, startIndex]);

	useEffect(() => {
		transform.current = [1, 0, 0, 1, 0, 0];
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setStartIndex(null);
		setEndIndex(null);
		setIsAnimated(false);
		setBounds(getBounds());
	}, [availablePaths]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (bounds) {
			initialZoom.current =
				Math.min(
					bounds.width / (bounds.right - bounds.left),
					bounds.height / (bounds.bottom - bounds.top)
				) - 0.2;
			setInitialZoomValue(initialZoom.current);

			handlePan(0, 0);
			handleZoom(initialZoom.current);
			setIsAnimated(true);
		}
	}, [bounds]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setPathBounds(
			startIndex !== null
				? getPathBounds(startIndex, pathsQuestionsState.value)
				: null
		);
	}, [startIndex, pathsQuestionsState.value]);

	return (
		<>
			<div className="relative bg-grey-light rounded-md aspect-6/4 overflow-hidden">
				{bounds && (
					<svg
						className="aspect-6/4"
						ref={svgRef}
						viewBox={`0 0 ${bounds.width} ${bounds.height}`}
						onMouseDown={handleMouseDown}
					>
						<defs>
							{/* Triangle */}
							{/* <marker
								id="marker"
								viewBox="0 0 6 6"
								refX="9"
								refY="3"
								markerWidth="6"
								markerHeight="6"
								markerUnits="strokeWidth"
								orient="auto"
							>
								<path
									d="M 1 1 L 5 3 L 1 5 z"
									fill="none"
									stroke="#000"
									strokeWidth="0.5"
								/>
							</marker> */}
							{/* <marker
								id="marker"
								viewBox="0 0 100 100"
								refX="0"
								refY="5"
								markerUnits="strokeWidth"
								markerWidth="100"
								markerHeight="100"
								orient="auto"
							>
								<path d="M 0 0 L 10 5 L 0 10 z" fill="#f00" />
							</marker> */}

							{/* Square */}
							<marker
								id="marker"
								viewBox="0 0 1 1"
								refX="0.5"
								refY="0.5"
								markerWidth="1"
								markerHeight="1"
								markerUnits="strokeWidth"
								orient="auto"
							>
								<rect
									x="0.05"
									y="0.05"
									width="0.9"
									height="0.9"
									fill="none"
									stroke="#000"
									strokeWidth="0.05"
								/>
							</marker>

							{/* Text */}
							{/* <marker
								id="marker"
								viewBox="0 0 22 8"
								refX="25"
								refY="4"
								markerWidth="22"
								markerHeight="8"
								orient="auto"
							>
								<text
									x="1"
									y="5"
									dominantBaseline="middle"
									style={{
										fontSize: 6,
										fontFamily: "sans-serif",
										textTransform: "uppercase",
									}}
								>
									Start
								</text>
							</marker> */}
						</defs>
						<g className="backdrop-blur-0">
							<g
								ref={groupRef}
								className="will-change-transform"
								style={{
									transition: isAnimated
										? "transform 0.5s ease"
										: undefined,
									backfaceVisibility: "hidden",
								}}
							>
								{pathsQuestionsState.value.map(
									(point, index) => {
										const { x, y } =
											getNormalisedCoordinate(
												point,
												bounds
											) as Coordinate;

										const { x: nextX, y: nextY } =
											getNormalisedCoordinate(
												pathsQuestionsState.value[
													index + 1
												],
												bounds
											);

										return (
											point.PointType === "ptNewPath" && (
												<Fragment
													key={`${x}-${y}-${index}`}
												>
													{pathsQuestionsState.value[
														index + 1
													] && (
														<line
															x1={x}
															y1={y}
															x2={nextX}
															y2={nextY}
															vectorEffect="non-scaling-stroke"
															strokeWidth={20}
															stroke="black"
															strokeOpacity={0}
															strokeLinecap="square"
															markerStart={
																pathsQuestionsState
																	.value[
																	index
																]?.PointType ===
																"ptNewPath"
																	? "url(#marker)"
																	: undefined
															}
														/>
													)}
												</Fragment>
											)
										);
									}
								)}
								{pathsQuestionsState.value.map(
									(point, index) => {
										const { x, y } =
											getNormalisedCoordinate(
												point,
												bounds
											) as Coordinate;

										const { x: nextX, y: nextY } =
											getNormalisedCoordinate(
												pathsQuestionsState.value[
													index + 1
												],
												bounds
											);

										const isInBounds =
											!pathBounds ||
											(pathBounds &&
												index >=
													pathBounds.startIndex &&
												index <= pathBounds.endIndex);

										return (
											<Fragment
												key={`${x}-${y}-${index}`}
											>
												{pathsQuestionsState.value[
													index + 1
												] &&
													pathsQuestionsState.value[
														index + 1
													]?.PointType !==
														"ptNewPath" && (
														<line
															x1={x}
															y1={y}
															x2={nextX}
															y2={nextY}
															stroke={
																PATH_COLORS[
																	Number(
																		point.PathType.slice(
																			-1
																		)
																	)
																]
															}
															strokeWidth={2}
															strokeOpacity={
																isInBounds
																	? 1
																	: 0.5
															}
															vectorEffect="non-scaling-stroke"
														/>
													)}
											</Fragment>
										);
									}
								)}
								{pathsQuestionsState.value.map(
									(point, index) => {
										const { x, y } =
											getNormalisedCoordinate(
												point,
												bounds
											) as Coordinate;

										const isInBounds =
											!pathBounds ||
											(pathBounds &&
												index >=
													pathBounds.startIndex &&
												index <= pathBounds.endIndex);

										const isHighlighted =
											hoverIndex === index ||
											startIndex === index ||
											(startIndex !== null &&
												hoverIndex !== null &&
												((index >= startIndex &&
													index <= hoverIndex) ||
													(index <= startIndex &&
														index >= hoverIndex)));

										const prevPoint =
											pathsQuestionsState.value[
												index - 1
											] &&
											pathsQuestionsState.value[index - 1]
												.PointType !== "ptNewPath"
												? pathsQuestionsState.value[
														index - 1
												  ]
												: point;
										const nextPoint =
											pathsQuestionsState.value[
												index + 1
											] &&
											pathsQuestionsState.value[index + 1]
												.PointType !== "ptNewPath"
												? pathsQuestionsState.value[
														index + 1
												  ]
												: point;

										return (
											<Fragment
												key={`${x}-${y}-${index}`}
											>
												<path
													d={`M ${x} ${y} l ${
														point.Features.length
															? 0.01
															: 0
													} 0`}
													strokeWidth="7"
													strokeLinecap={
														point.Features.length
															? "square"
															: "round"
													}
													stroke={
														isInBounds
															? isHighlighted
																? "#FACC15"
																: point.Features
																		.length
																? "#000"
																: point.RawPoint
																? "#444"
																: "#555"
															: "#777"
													}
													className={`${
														isInBounds
															? ""
															: "pointer-events-none"
													}`}
													vectorEffect="non-scaling-stroke"
													transform={`rotate(${
														getLineAngle(
															{
																x: prevPoint.X,
																y: prevPoint.Y,
															},
															{
																x: nextPoint.X,
																y: nextPoint.Y,
															}
														) + 45
													} ${x} ${y})`}
													cursor="pointer"
													onClick={() => {
														if (
															!isDragging.current
														) {
															if (
																startIndex ===
																index
															) {
																setStartIndex(
																	null
																);
															} else if (
																startIndex ===
																null
															) {
																setStartIndex(
																	index
																);
																setPathType(
																	point.PathType
																);
																setOpenModal();
															} else if (
																endIndex ===
																null
															) {
																setEndIndex(
																	index
																);
															}
														}
													}}
													onMouseOver={(_e) => {
														if (
															!isDragging.current
														) {
															if (isInBounds) {
																setHoverIndex(
																	index
																);
															}
														}
													}}
													onMouseOut={(_e) => {
														if (
															!isDragging.current
														) {
															setHoverIndex(null);
														}
													}}
												/>
											</Fragment>
										);
									}
								)}
							</g>
						</g>
					</svg>
				)}
				<div className="absolute bottom-5 left-5">
					<details
						className={`relative text-white rounded-md bg-black hover:bg-black-subtle open:bg-black-subtle/10 open:hover:bg-black-subtle/10 open:border open:border-black/30 select-none backdrop-blur-sm`}
						open={keyIsOpen}
						onClick={(event) => {
							event.preventDefault();
						}}
					>
						<summary
							className={
								keyIsOpen ? "absolute top-0 right-0" : ""
							}
							onClick={() => {
								setKeyIsOpen();
							}}
						>
							{keyIsOpen ? (
								<div className="flex items-center justify-center w-8 h-8 hover:opacity-70">
									<span className="sr-only">Close</span>
									<RenderIcon
										icon={Icons.Interface.CloseSmall}
										sizes={"w-3.5 h-3.5"}
									/>
								</div>
							) : (
								<div className="flex items-center pl-2.5 pr-4 py-2">
									<RenderIcon icon={Icons.Menu.Lines} />
									<span className="ml-2 text-button font-medium">
										{t("key")}
									</span>
								</div>
							)}
						</summary>
						<div className="p-4 min-w-[10rem] max-w-[15rem]">
							<h4 className="text-button font-medium pr-4">
								{t("key")}
							</h4>
							<ul className="text-button mt-4">
								<li className="flex items-center mt-5">
									<span className="w-[0.4375rem] h-[0.4375rem] ml-[0.21875rem] mr-[0.84375rem] mt-px bg-[#555] rounded-full"></span>
									{t("points")}
								</li>
								<li className="flex items-center mt-3">
									<span className="w-[0.4375rem] h-[0.4375rem] ml-[0.21875rem] mr-[0.84375rem] mt-px bg-[#000] rotate-45"></span>
									{t("features")}
								</li>
								{allowedPathTypes?.map((pathType) => (
									<li
										key={pathType.ID}
										className="flex items-center mt-3"
									>
										<span
											className="border-t-[3px] mt-px w-3.5 mr-2.5"
											style={{
												color: PATH_COLORS[
													pathType.Seq - 1
												],
											}}
										></span>
										{pathType.Name}
									</li>
								))}
							</ul>
						</div>
					</details>
				</div>
				<div className="absolute bottom-5 right-5">
					<button
						className="flex items-center justify-center w-8 h-8 rounded-sm mt-1 text-white bg-black hover:bg-black-subtle disabled:bg-black/40 disabled:backdrop-blur-sm"
						onClick={() => {
									handleZoom(zoom * 2);
						}}
						type="button"
						disabled={zoom > initialZoomValue * 100}
					>
						<span className="sr-only">{t("zoomIn")}</span>
						<RenderIcon icon={Icons.Edit.Plus} />
					</button>
					<button
						className="flex items-center justify-center w-8 h-8 rounded-sm mt-1 text-white bg-black hover:bg-black-subtle disabled:bg-black/40 disabled:backdrop-blur-sm"
						onClick={() => {
							handleZoom(zoom * 0.5);
						}}
						type="button"
						disabled={zoom <= initialZoomValue}
					>
						<span className="sr-only">{t("zoomOut")}</span>
						<RenderIcon icon={Icons.Edit.Minus} />
					</button>
				</div>
			</div>
			<EditPathFeature
				openModal={openModal}
				setOpenModal={setOpenModal}
				pathType={pathType}
				setPathType={setPathType}
				startIndex={startIndex}
				setStartIndex={setStartIndex}
			/>
		</>
	);
};
