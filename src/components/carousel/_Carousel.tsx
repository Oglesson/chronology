import { Swiper as SwiperProps } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { CarouselFooter } from "./_CarouselFooter";

import { ReactNode } from "react";
import "swiper/css";

type CarouselProps = {
	children: ReactNode[];
	onIndexChange?: (swiper: SwiperProps) => void;
};

export const Carousel = ({
	children,
	onIndexChange,
	...props
}: CarouselProps) => (
	<div className="bg-white dark:bg-black-subtle rounded-md p-8" {...props}>
		<Swiper slidesPerView={1} onActiveIndexChange={onIndexChange}>
			{children.map(
				(child, index) =>
					child && <SwiperSlide key={index}>{child}</SwiperSlide>
			)}
			<CarouselFooter />
		</Swiper>
	</div>
);
