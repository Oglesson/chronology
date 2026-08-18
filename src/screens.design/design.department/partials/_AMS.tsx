import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Carousel } from "../../../components/carousel/_Carousel";
import { CircleChart } from "../../../components/charts/CircleChart";
import { useDesignDepartment } from "../../../hooks.queries/useDesignDepartment";

export const AMS = () => {
	const styleDepartment = useDesignDepartment();
	const { t } = useTranslation();
	const [carouselIndex, setCarouselIndex] = useState(0);

	if (!styleDepartment) {
		return <></>;
	}

	const { Calculations: calculations } = styleDepartment!;
	const { Minutes: minutes } = calculations!.Allowed_Time;

	return (
		<Carousel
			onIndexChange={(swiper) => {
				setCarouselIndex(swiper.activeIndex);
			}}
		>
			<div>
				<h4 className="typo-h4 mb-7">
					{t("costed", {
						defaultValue: "Costed",
					})}
				</h4>

				<p className="typo-h2  mb-6">
					{minutes.Costed_Total.toFixed(2)}
				</p>

				<div className="grid-container mt-10">
					<div className="col-span-5">
						<h5 className="flex items-center typo-pre-heading text-grey-light">
							<div className="w-2.5 h-2.5 mr-2 rounded-full bg-green"></div>
							{t("va", {
								defaultValue: "VA",
							})}
						</h5>
						<p className="mt-0.5 mb-6">
							{minutes.Costed_VA.toFixed(2)}
						</p>
						<h5 className="flex items-center typo-pre-heading text-grey-light">
							<div className="w-2.5 h-2.5 mr-2 rounded-full bg-decline"></div>
							{t("nva", {
								defaultValue: "NVA",
							})}
						</h5>
						<p className="mt-0.5 mb-6">
							{minutes.Costed_NVA.toFixed(2)}
						</p>
					</div>
					<div className="col-span-7">
						<CircleChart
							data={[
								{
									name: "VA",
									value: minutes.Costed_VA,
									color: "#00F3BB",
								},
								{
									name: "NVA",
									value: minutes.Costed_NVA,

									color: "#f94c40",
								},
							]}
							label={
								<>
									{t("value", {
										defaultValue: "Value",
									})}{" "}
									<span className="text-white">
										{t("vs", {
											defaultValue: "vs",
										})}
									</span>{" "}
									{t("nonValueAdded", {
										defaultValue: "Non-Value Added",
									})}
								</>
							}
							play={carouselIndex === 0}
						/>
					</div>
				</div>
			</div>
			<div>
				<h4 className="typo-h4 mb-7">
					{t("costed", {
						defaultValue: "Costed",
					})}
				</h4>
				<div className="grid-container mt-10">
					<div className="col-span-6">
						<h5 className="typo-pre-heading text-grey-light">
							{t("cost", {
								defaultValue: "Cost",
							})}
						</h5>
						<p className="mt-0.5 mb-4">
							{calculations?.Cost_PairsCosted.toFixed(2)}
						</p>
					</div>
				</div>
			</div>
			<div>
				<h4 className="typo-h4 mb-7">
					{t("batch", {
						defaultValue: "Batch",
					})}
				</h4>

				<p className="typo-h2  mb-6">{minutes.Total.toFixed(2)}</p>

				<div className="grid-container mt-10">
					<div className="col-span-5">
						<h5 className="flex items-center typo-pre-heading text-grey-light">
							<div className="w-2.5 h-2.5 mr-2 rounded-full bg-green"></div>
							{t("va", {
								defaultValue: "VA",
							})}
						</h5>
						<p className="mt-0.5 mb-6">{minutes.VA.toFixed(2)}</p>
						<h5 className="flex items-center typo-pre-heading text-grey-light">
							<div className="w-2.5 h-2.5 mr-2 rounded-full bg-decline"></div>
							{t("nva", {
								defaultValue: "NVA",
							})}
						</h5>
						<p className="mt-0.5 mb-6">{minutes.NVA.toFixed(2)}</p>
					</div>
					<div className="col-span-7">
						<CircleChart
							data={[
								{
									name: "VA",
									value: minutes.VA,
									color: "#00F3BB",
								},
								{
									name: "NVA",
									value: minutes.NVA,
									color: "#f94c40",
								},
							]}
							label={
								<>
									{t("value", {
										defaultValue: "Value",
									})}{" "}
									<span className="text-white">
										{t("vs", {
											defaultValue: "vs",
										})}
									</span>{" "}
									{t("nonValueAdded", {
										defaultValue: "Non-Value Added",
									})}
								</>
							}
							play={carouselIndex === 2}
						/>
					</div>
				</div>
			</div>
			<div>
				<h4 className="typo-h4 mb-7">
					{t("batch", {
						defaultValue: "Batch",
					})}
				</h4>
				<div className="grid-container mt-10">
					<div className="col-span-6">
						<h5 className="typo-pre-heading text-grey-light">
							{t("cost", {
								defaultValue: "Cost",
							})}
						</h5>
						<p className="mt-0.5 mb-4">
							{calculations?.Cost_Batch.toFixed(2)}
						</p>
					</div>
				</div>
			</div>
		</Carousel>
	);
};
