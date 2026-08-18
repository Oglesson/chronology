import classNames from "classnames";
import { useState } from "react";
import { useSwiper } from "swiper/react";
import { Button } from "../common/button/Button";
import Icons from "../../config.common/Icons";

export const CarouselFooter = () => {
	const [activeIndex, setActiveIndex] = useState(0);
	const swiper = useSwiper();
	const totalSlides = swiper?.slides?.length ?? 0;

	swiper.on("activeIndexChange", (swiper) =>
		setActiveIndex(swiper.activeIndex)
	);

	const renderNavItems = () =>
		Array.from({ length: totalSlides }, (_, i) => (
			<button
				key={i}
				type="button"
				className={classNames(
					activeIndex === i && "pointer-events-none"
				)}
				onClick={() => {
					swiper.slideTo(i);
				}}
			>
				<span className="sr-only">Go to slide {i + 1}</span>
				<span
					className={classNames(
						"block w-2 h-2 rounded-full",
						activeIndex !== i && "bg-grey-mid",
						activeIndex === i && "bg-green"
					)}
				></span>
			</button>
		));

	return (
		<footer className="flex items-center justify-between mt-6">
			{totalSlides && (
				<nav className="space-x-1.5">{renderNavItems()}</nav>
			)}
			<div className="flex items-center space-x-1.5">
				<Button
					iconOnly
					text="Previous slide"
					icon={Icons.Interface.ArrowBackSmall}
					onClick={() => swiper.slidePrev()}
					disabled={activeIndex === 0}
					style="tertiary"
				/>
				<Button
					iconOnly
					text="Next slide"
					icon={Icons.Interface.ArrowNextSmall}
					onClick={() => swiper.slideNext()}
					disabled={activeIndex === totalSlides - 1}
					style="tertiary"
				/>
			</div>
		</footer>
	);
};
