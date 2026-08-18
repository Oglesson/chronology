import { DetailedHTMLProps, DetailsHTMLAttributes, ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { useTranslation } from "react-i18next";
import ReactModal from "react-modal";
import Icons from "../../config.common/Icons";
import { useToggle } from "../../hooks.common/useToggle";
import { RenderIcon } from "../../utilities.common/RenderIcon";

type HelpProps = DetailedHTMLProps<
	DetailsHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
> & {
	className?: string;
	children: ReactNode;
	content: ReactNode;
};

export const Help = ({ className, children, content, ...props }: HelpProps) => {
	const [isOpen, setIsOpen] = useToggle(false);

	const { t } = useTranslation();

	const transition = {
		ease: [0.6, 0, 0.2, 1] as const,
		duration: 0.5,
	};

	return (
		<>
			<button
				{...props}
				className={className}
				type="button"
				onClick={(event) => {
					setIsOpen();
					props.onClick?.(event);
				}}
			>
				{children}
			</button>
			<ReactModal
				closeTimeoutMS={500}
				shouldReturnFocusAfterClose={false}
				onRequestClose={() => {
					setIsOpen();
				}}
				isOpen={isOpen}
				appElement={document.querySelector("[data-app]") as HTMLElement}
				portalClassName="help"
				overlayClassName="fixed z-100 inset-y-0 left-0 w-screen bg-true-black/90 overflow-hidden [scrollbar-gutter:stable]"
				className={`relative w-[43.75rem] h-full p-6 ml-auto bg-gradient-dark overflow-auto outline-0`}
				overlayElement={(props, children) => (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: isOpen ? 1 : 0 }}
						transition={transition}
						{...(props as HTMLMotionProps<"div">)}
					>
						{children}
					</motion.div>
				)}
				contentElement={(props, children) => (
					<motion.div
						initial={{ translateX: "100%" }}
						animate={{ translateX: isOpen ? "0%" : "100%" }}
						transition={transition}
						{...(props as HTMLMotionProps<"div">)}
					>
						<button
							className="float-right sticky top-0 transition-opacity duration-200 hover:opacity-60"
							type="button"
							onClick={setIsOpen}
						>
							<span className="sr-only">{t("close")}</span>
							<RenderIcon
								icon={Icons.Interface.Close}
								classes="w-7 h-7"
							/>
						</button>
						{children}
					</motion.div>
				)}
				htmlOpenClassName="scrollbar-lock"
			>
				{content}
			</ReactModal>
		</>
	);
};
