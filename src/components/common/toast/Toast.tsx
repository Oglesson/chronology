import { useContext, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Icons from "../../../config.common/Icons";
import {
	NotificationContext,
	NotificationProps,
} from "../../../context.common/NotificationContext";
import { RenderIcon } from "../../../utilities.common/RenderIcon";

type ToastProps = {
	notification: NotificationProps;
};

export const Toast = ({ notification }: ToastProps) => {
	const { removeNotification } = useContext(NotificationContext);
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const { duration, heading, message, type, dismissDisabled } = notification;
	const { t } = useTranslation();

	const handleClose = () => {
		removeNotification(notification.id!);
	};

	useEffect(() => {
		if (duration !== 0) {
			timer.current = setTimeout(() => {
				handleClose();
			}, duration ?? 5000);
		}
		return () => {
			clearTimeout(timer.current);
		};
	}, []);

	const renderIcon = (type?: typeof notification.type) => {
		switch (type) {
			case "error":
				return (
					<RenderIcon
						icon={Icons.Interface.Warning}
						classes="block text-decline"
					/>
				);
			case "success":
				return (
					<RenderIcon
						icon={Icons.Interface.Check}
						classes="block text-green"
					/>
				);
			default:
				return (
					<RenderIcon
						icon={Icons.Interface.Info}
						classes="block text-black"
					/>
				);
		}
	};

	if (!message) {
		return <></>;
	}

	return (
		<motion.div
			initial={{ opacity: 0, translateY: "100%" }}
			animate={{ opacity: 1, translateY: "0%" }}
			exit={{ opacity: 0, translateY: "100%" }}
			transition={{
				type: "tween",
				ease: "easeInOut",
				duration: 0.5,
			}}
			className="fixed z-[1000] bottom-0 left-0 w-screen p-7 overflow-hidden pointer-events-none [scrollbar-gutter:stable]"
			role="alert"
		>
			<div className="w-96 max-w-full ml-auto pr-3.5 pl-7 pb-8 rounded-md text-black bg-white pointer-events-auto">
				<div className="flex items-start">
					<div className="pt-8 flex-none">{renderIcon(type)}</div>
					<div className="pt-8 ml-3.5">
						{heading && (
							<h5 className="mt-1 mb-2.5 typo-pre-heading text-grey-light">
								{heading}
							</h5>
						)}
						<div>{message}</div>
					</div>
					{!dismissDisabled && (
						<button
							className="ml-auto pt-3.5 text-black transition-colors duration-300 ease-hover hover:text-grey-light"
							type="button"
							onClick={handleClose}
						>
							<RenderIcon
								icon={Icons.Interface.Close}
								classes="block"
								sizes="w-5 h-5"
							/>
							<span className="sr-only">{t("close")}</span>
						</button>
					)}
				</div>
			</div>
		</motion.div>
	);
};
