import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Carousel } from "../../../components/carousel/_Carousel";
import { CircleChart } from "../../../components/charts/CircleChart";
import { useProcess } from "../../../hooks.queries/useProcess";
import { PATH_COLORS } from "../../../constants.common/path";

export const AMS = () => {
	const process = useProcess();
	const { t } = useTranslation();

	const [carouselIndex, setCarouselIndex] = useState(0);

	return (
		<Carousel
			onIndexChange={(swiper) => {
				setCarouselIndex(swiper.activeIndex);
			}}
		>
			<div>
				<h4 className="typo-h4 mb-7">
					{t("allowedMinutes", {
						defaultValue: "Allowed Minutes (Ams)",
					})}
				</h4>
				<p className="typo-h2 mt-1.5">
					{process.Calculations?.Allowed_Time.Minutes.Total.toFixed(
						2
					)}
				</p>

				<div className="grid-container mt-10">
					<div className="col-span-5">
						<h5 className="flex items-center typo-pre-heading text-grey-light">
							<div className="w-2.5 h-2.5 mr-2 rounded-full bg-green"></div>
							{t("va", {
								defaultValue: "VA",
							})}
						</h5>
						<p className="mt-0.5 mb-4">
							{process.Calculations?.Allowed_Time.Minutes.VA.toFixed(
								2
							)}
						</p>
						<h5 className="flex items-center typo-pre-heading text-grey-light">
							<div className="w-2.5 h-2.5 mr-2 rounded-full bg-decline"></div>
							{t("nva", {
								defaultValue: "NVA",
							})}
						</h5>
						<p className="mt-0.5 mb-4">
							{process.Calculations?.Allowed_Time.Minutes.NVA.toFixed(
								2
							)}
						</p>
					</div>
					<div className="col-span-7">
						<CircleChart
							data={[
								{
									name: "VA",
									value: Number(
										process.CategoryKind === "ocGroup" &&
											!process.UseVGRestCont
											? process.Calculations?.Allowed_Time.Minutes.Group.Notional_VA.toFixed(
													2
											  )
											: process.Calculations?.Allowed_Time.Minutes.VA.toFixed(
													2
											  )
									),
									color: "#00F3BB",
								},
								{
									name: "NVA",
									value: Number(
										process.CategoryKind === "ocGroup" &&
											!process.UseVGRestCont
											? process?.Calculations?.Allowed_Time?.Minutes.Group?.Notional_NVA?.toFixed(
													2
											  )
											: process?.Calculations?.Allowed_Time?.Minutes?.NVA?.toFixed(
													2
											  )
									),
									color: "#f94c40",
								},
							]}
							label={
								<>
									Value <span className="text-white">vs</span>{" "}
									Non-Value Added
								</>
							}
							play={carouselIndex === 0}
						/>
					</div>
				</div>
			</div>
			{process.CategoryKind === "ocCutting" && (
				<div>
					<h4 className="typo-h4  mb-7">
						{t("allowedMinutes", {
							defaultValue: "Allowed Minutes (Ams)",
						})}
					</h4>

					<div className="grid-container mt-10">
						<div className="col-span-5">
							<h5 className="flex items-center typo-pre-heading text-grey-light">
								<div className="w-2.5 h-2.5 mr-2 rounded-full bg-chart-purple"></div>

								{t("setup", {
									defaultValue: "Setup",
								})}
							</h5>
							<p className="mt-0.5 mb-4">
								{process.Calculations?.Allowed_Time.Minutes.Cutting.Setup.toFixed(
									2
								)}
							</p>
							<h5 className="flex items-center typo-pre-heading text-grey-light">
								<div className="w-2.5 h-2.5 mr-2 rounded-full bg-chart-blue"></div>

								{t("materialHandling", {
									defaultValue: "Material Handling",
								})}
							</h5>
							<p className="mt-0.5 mb-4">
								{process.Calculations?.Allowed_Time.Minutes.Cutting.MaterialHandling.toFixed(
									2
								)}
							</p>
							<h5 className="flex items-center typo-pre-heading text-grey-light">
								<div className="w-2.5 h-2.5 mr-2 rounded-full bg-chart-yellow"></div>

								{t("cutting", {
									defaultValue: "Cutting",
								})}
							</h5>
							<p className="mt-0.5 mb-4">
								{process.Calculations?.Allowed_Time.Minutes.Cutting.Cutting.toFixed(
									2
								)}
							</p>
							<h5 className="flex items-center typo-pre-heading text-grey-light">
								<div className="w-2.5 h-2.5 mr-2 rounded-full bg-chart-pink"></div>

								{t("cutPartHandling", {
									defaultValue: "Cut Part Handling",
								})}
							</h5>
							<p className="mt-0.5 mb-4">
								{process.Calculations?.Allowed_Time.Minutes.Cutting.CutPartHandling.toFixed(
									2
								)}
							</p>
							<h5 className="flex items-center typo-pre-heading text-grey-light">
								<div className="w-2.5 h-2.5 mr-2 rounded-full bg-chart-orange"></div>

								{t("additional", {
									defaultValue: "Additional",
								})}
							</h5>
							<p className="mt-0.5 mb-4">
								{process.Calculations?.Allowed_Time.Minutes.Cutting.Additional.toFixed(
									2
								)}
							</p>
						</div>
						<div className="col-span-7">
							<CircleChart
								data={[
									{
										name: t("setup", {
											defaultValue: "Setup",
										}),
										value:
											process.Calculations?.Allowed_Time
												.Minutes.Cutting.Setup || 0,
										color: PATH_COLORS[1],
									},
									{
										name: t("materialHandling", {
											defaultValue: "Material Handling",
										}),
										value:
											process.Calculations?.Allowed_Time
												.Minutes.Cutting
												.MaterialHandling || 0,
										color: PATH_COLORS[2],
									},
									{
										name: t("cutting", {
											defaultValue: "Cutting",
										}),
										value:
											process.Calculations?.Allowed_Time
												.Minutes.Cutting.Cutting || 0,
										color: PATH_COLORS[6],
									},
									{
										name: t("cutPartHandling", {
											defaultValue: "Cut Part Handling",
										}),
										value:
											process.Calculations?.Allowed_Time
												.Minutes.Cutting
												.CutPartHandling || 0,
										color: PATH_COLORS[4],
									},
									{
										name: t("additional", {
											defaultValue: "Additional",
										}),
										value:
											process.Calculations?.Allowed_Time
												.Minutes.Cutting.Additional ||
											0,
										color: PATH_COLORS[5],
									},
								]}
								label={t("cuttingBreakdown", {
									defaultValue: "Cutting Breakdown",
								})}
								play={carouselIndex === 1}
							/>
						</div>
					</div>
				</div>
			)}
			<div>
				<h4 className="typo-h4  mb-7">
					{t("allowedMinutes", {
						defaultValue: "Allowed Minutes (Ams)",
					})}
				</h4>
				<div className="grid-container mt-10">
					<div className="col-span-6">
						<h5 className="typo-pre-heading text-grey-light">
							{t("sequential", {
								defaultValue: "Sequential",
							})}
						</h5>
						<p className="mt-0.5 mb-4">
							{process.Calculations?.Allowed_Time.Minutes.Sequential.toFixed(
								2
							)}
						</p>
						<h5 className="typo-pre-heading text-grey-light">
							{t("simo1", {
								defaultValue: "Simo 1",
							})}
						</h5>
						<p
							className={`mt-0.5 mb-4${
								process.Calculations?.Simo &&
								process.Calculations?.Simo !== 1
									? " line-through"
									: ""
							}`}
						>
							{process.Calculations?.Allowed_Time.Minutes.Simo1.toFixed(
								2
							)}
						</p>
						<h5 className="typo-pre-heading text-grey-light">
							{t("simo2", {
								defaultValue: "Simo 2",
							})}
						</h5>
						<p
							className={`mt-0.5 mb-4${
								process.Calculations?.Simo &&
								process.Calculations?.Simo !== 2
									? " line-through"
									: ""
							}`}
						>
							{process.Calculations?.Allowed_Time.Minutes.Simo2.toFixed(
								2
							)}
						</p>
					</div>
					<div className="col-span-6">
						<h5 className="typo-pre-heading text-grey-light">
							{t("cost", {
								defaultValue: "Cost",
							})}
						</h5>
						<p className="mt-0.5 mb-4">
							{process.Calculations?.Cost_Batch.toFixed(2)}
						</p>
					</div>
				</div>
			</div>
			<div>
				<h4 className="typo-h4  mb-7">
					{t("basicMinutes", {
						defaultValue: "Basic Minutes (Bms)",
					})}
				</h4>
				<p className="typo-h2 mt-1.5">
					{process.Calculations?.Basic_Time.Minutes.Total.toFixed(
						2
					)}
				</p>

				<div className="grid-container mt-10">
					<div className="col-span-5">
						<h5 className="flex items-center typo-pre-heading text-grey-light">
							<div className="w-2.5 h-2.5 mr-2 rounded-full bg-green"></div>
							{t("va", {
								defaultValue: "VA",
							})}
						</h5>
						<p className="mt-0.5 mb-4">
							{process.Calculations?.Basic_Time.Minutes.VA.toFixed(
								2
							)}
						</p>
						<h5 className="flex items-center typo-pre-heading text-grey-light">
							<div className="w-2.5 h-2.5 mr-2 rounded-full bg-decline"></div>
							{t("nva", {
								defaultValue: "NVA",
							})}
						</h5>
						<p className="mt-0.5 mb-4">
							{process.Calculations?.Basic_Time.Minutes.NVA.toFixed(
								2
							)}
						</p>
					</div>
					<div className="col-span-7">
						<CircleChart
							data={[
								{
									name: "VA",
									value:
										process.Calculations?.Basic_Time
											.Minutes.VA || 0,
									color: "#00F3BB",
								},
								{
									name: "NVA",
									value:
										process.Calculations?.Allowed_Time
											.Minutes.NVA || 0,
									color: "#f94c40",
								},
							]}
							label={
								<>
									Value <span className="text-white">vs</span>{" "}
									Non-Value Added
								</>
							}
							play={
								process.CategoryKind === "ocCutting"
									? carouselIndex === 3
									: carouselIndex === 2
							}
						/>
					</div>
				</div>
			</div>
			{process.CategoryKind === "ocCutting" && (
				<div>
					<h4 className="typo-h4  mb-7">
						{t("basicMinutes", {
							defaultValue: "Basic Minutes (Bms)",
						})}
					</h4>

					<div className="grid-container mt-10">
						<div className="col-span-5">
							<h5 className="flex items-center typo-pre-heading text-grey-light">
								<div className="w-2.5 h-2.5 mr-2 rounded-full bg-chart-purple"></div>

								{t("setup", {
									defaultValue: "Setup",
								})}
							</h5>
							<p className="mt-0.5 mb-4">
								{process.Calculations?.Basic_Time.Minutes.Cutting.Setup.toFixed(
									2
								)}
							</p>
							<h5 className="flex items-center typo-pre-heading text-grey-light">
								<div className="w-2.5 h-2.5 mr-2 rounded-full bg-chart-blue"></div>

								{t("materialHandling", {
									defaultValue: "Material Handling",
								})}
							</h5>
							<p className="mt-0.5 mb-4">
								{process.Calculations?.Basic_Time.Minutes.Cutting.MaterialHandling.toFixed(
									2
								)}
							</p>
							<h5 className="flex items-center typo-pre-heading text-grey-light">
								<div className="w-2.5 h-2.5 mr-2 rounded-full bg-chart-yellow"></div>

								{t("cutting", {
									defaultValue: "Cutting",
								})}
							</h5>
							<p className="mt-0.5 mb-4">
								{process.Calculations?.Basic_Time.Minutes.Cutting.Cutting.toFixed(
									2
								)}
							</p>
							<h5 className="flex items-center typo-pre-heading text-grey-light">
								<div className="w-2.5 h-2.5 mr-2 rounded-full bg-chart-pink"></div>

								{t("cutPartHandling", {
									defaultValue: "Cut Part Handling",
								})}
							</h5>
							<p className="mt-0.5 mb-4">
								{process.Calculations?.Basic_Time.Minutes.Cutting.CutPartHandling.toFixed(
									2
								)}
							</p>
							<h5 className="flex items-center typo-pre-heading text-grey-light">
								<div className="w-2.5 h-2.5 mr-2 rounded-full bg-chart-orange"></div>

								{t("additional", {
									defaultValue: "Additional",
								})}
							</h5>
							<p className="mt-0.5 mb-4">
								{process.Calculations?.Basic_Time.Minutes.Cutting.Additional.toFixed(
									2
								)}
							</p>
						</div>
						<div className="col-span-7">
							<CircleChart
								data={[
									{
										name: t("setup", {
											defaultValue: "Setup",
										}),
										value:
											process.Calculations?.Basic_Time
												.Minutes.Cutting.Setup || 0,
										color: PATH_COLORS[1],
									},
									{
										name: t("materialHandling", {
											defaultValue: "Material Handling",
										}),
										value:
											process.Calculations?.Basic_Time
												.Minutes.Cutting
												.MaterialHandling || 0,
										color: PATH_COLORS[2],
									},
									{
										name: t("cutting", {
											defaultValue: "Cutting",
										}),
										value:
											process.Calculations?.Basic_Time
												.Minutes.Cutting.Cutting || 0,
										color: PATH_COLORS[6],
									},
									{
										name: t("cutPartHandling", {
											defaultValue: "Cut Part Handling",
										}),
										value:
											process.Calculations?.Basic_Time
												.Minutes.Cutting
												.CutPartHandling || 0,
										color: PATH_COLORS[4],
									},
									{
										name: t("additional", {
											defaultValue: "Additional",
										}),
										value:
											process.Calculations?.Basic_Time
												.Minutes.Cutting.Additional ||
											0,
										color: PATH_COLORS[5],
									},
								]}
								label={t("cuttingBreakdown", {
									defaultValue: "Cutting Breakdown",
								})}
								play={carouselIndex === 4}
							/>
						</div>
					</div>
				</div>
			)}
			<div>
				<h4 className="typo-h4  mb-7">
					{t("basicMinutes", {
						defaultValue: "Basic Minutes (Bms)",
					})}
				</h4>
				<div className="grid-container mt-10">
					<div className="col-span-6">
						<h5 className="typo-pre-heading text-grey-light">
							{t("sequential", {
								defaultValue: "Sequential",
							})}
						</h5>
						<p className="mt-0.5 mb-4">
							{process.Calculations?.Basic_Time.Minutes.Sequential.toFixed(
								2
							)}
						</p>
						<h5 className="typo-pre-heading text-grey-light">
							{t("simo1", {
								defaultValue: "Simo 1",
							})}
						</h5>
						<p className="mt-0.5 mb-4">
							{process.Calculations?.Basic_Time.Minutes.Simo1.toFixed(
								2
							)}
						</p>
						<h5 className="typo-pre-heading text-grey-light">
							{t("simo2", {
								defaultValue: "Simo 2",
							})}
						</h5>
						<p className="mt-0.5 mb-4">
							{process.Calculations?.Basic_Time.Minutes.Simo2.toFixed(
								2
							)}
						</p>
					</div>
				</div>
			</div>
			<div>
				<h4 className="typo-h4 mb-7">
					{t("output", {
						defaultValue: "Output",
					})}
				</h4>
				<div className="grid-container mt-8">
					<div className="col-span-6">
						<h5 className="typo-pre-heading text-grey-light">
							{process.MadeInPairs
								? t("secs/pair", {
										defaultValue: "Secs / Pair",
								  })
								: t("secs/single", {
										defaultValue: "Secs / Single",
								  })}
						</h5>
						<p className="mt-0.5 mb-4">
							{process.Calculations?.SecsPerUnit.toFixed(2)}
						</p>
						<h5 className="typo-pre-heading text-grey-light">
							{process.MadeInPairs
								? t("pairs/hour", {
										defaultValue: "Pairs / Hour",
								  })
								: t("singles/hour", {
										defaultValue: "Singles / Hour",
								  })}
						</h5>
						<p className="mt-0.5 mb-4">
							{process.Calculations?.UnitsPerHr.toFixed(2)}
						</p>
						<h5 className="typo-pre-heading text-grey-light">
							{process.MadeInPairs
								? t("pairs/day", {
										defaultValue: "Pairs / Day",
								  })
								: t("singles/day", {
										defaultValue: "Singles / Day",
								  })}
						</h5>
						<p className="mt-0.5 mb-4">
							{process.Calculations?.UnitsPerDay.toFixed(2)}
						</p>
					</div>
				</div>
			</div>
		</Carousel>
	);
};
