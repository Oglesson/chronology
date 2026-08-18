import { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import ReactModal from "react-modal";
import "./modal.scss";

export type ModalProps = {
	alignment?: "center" | "right";
	children: ReactNode;
	isOpen: boolean;
	width?: `w-${string}`;
	height?: `h-${string}`;
};

export const Modal = ({
	alignment,
	isOpen,
	children,
	width,
	height,
	...props
}: ModalProps) => {
	const transition = {
		ease: [0.6, 0, 0.2, 1] as const,
		duration: 0.5,
	};

	return (
		<ReactModal
			shouldReturnFocusAfterClose={false}
			closeTimeoutMS={500}
			isOpen={isOpen}
			appElement={document.querySelector("[data-app]") as HTMLElement}
			portalClassName="modal"
			overlayClassName="modal__overlay"
			className={`modal__content ${
				alignment ? `modal__content--${alignment}` : ""
			} ${width ?? "w-110"} ${height ?? ""}`}
			overlayElement={(props, content) => (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: isOpen ? 1 : 0 }}
					exit={{ opacity: 0 }}
					transition={transition}
					{...(props as HTMLMotionProps<"div">)}
				>
					{content}
				</motion.div>
			)}
			contentElement={(props, ctnt) => (
				<motion.div
					initial={
						alignment === "right"
							? { translateX: "100%" }
							: { translateY: 50 }
					}
					animate={
						alignment === "right"
							? { translateX: isOpen ? "0%" : "100%" }
							: { translateY: isOpen ? 0 : 50 }
					}
					transition={transition}
					{...(props as HTMLMotionProps<"div">)}
				>
					{ctnt}
				</motion.div>
			)}
			htmlOpenClassName="scrollbar-lock"
			{...props}
		>
			{children}
		</ReactModal>
	);
};
