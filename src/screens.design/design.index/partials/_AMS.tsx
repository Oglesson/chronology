import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Carousel } from "../../../components/carousel/_Carousel";
import { CircleChart } from "../../../components/charts/CircleChart";
import { useDesign } from "../../../hooks.queries/useDesign";

export const AMS = () => {
	const style = useDesign();
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
					{t("costed", {
						defaultValue: "Costed",
					})}
				</h4>
				<p className="typo-h2 mt-1.5">
					{style.Allowed_Time_PairsCosted?.Minutes.Total.toFixed(2)}
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
							{style.Allowed_Time_PairsCosted?.Minutes.VA.toFixed(
								2
							)}
						</p>
						<h5 className="flex items-center typo-pre-heading text-grey-light">
							<div className="w-2.5 h-2.5 mr-2 rounded-full bg-decline"></div>
							{t("nva", {
								defaultValue: "NVA",
							})}
						</h5>
						<p className="mt-0.5 mb-6">
							{style.Allowed_Time_PairsCosted?.Minutes.NVA.toFixed(
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
										style.Allowed_Time_PairsCosted?.Minutes
											.VA || 0,
									color: "#00F3BB",
								},
								{
									name: "NVA",
									value:
										style.Allowed_Time_PairsCosted?.Minutes
											.NVA || 0,
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
			<div>
				<h4 className="typo-h4 mb-7">
					{t("costed", {
						defaultValue: "Costed",
					})}
				</h4>
				<div className="grid-container mt-10">
					<div className="col-span-5">
						<h5 className="typo-pre-heading text-grey-light">
							{t("cost", {
								defaultValue: "Cost",
							})}
						</h5>
						<p className="mt-0.5 mb-4">
							{style.Cost_PairsCosted?.toFixed(2)}
						</p>
					</div>
				</div>
			</div>
		</Carousel>
	);
};
