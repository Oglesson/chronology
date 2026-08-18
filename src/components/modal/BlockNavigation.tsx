import Lottie from "lottie-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useBlocker } from "react-router-dom";
import { Button } from "../common/button/Button";
import animation from "../../data.lottie/warning.json";
import { Modal } from "./Modal";

type BlockNavigationProps = {
	body?: string;
	heading?: string;
	isBlocked: boolean;
	stopNavAction?: () => void;
};

export const BlockNavigation = ({
	body,
	heading,
	isBlocked,
	stopNavAction,
}: BlockNavigationProps) => {
	const blocker = useBlocker(isBlocked);
	const { t } = useTranslation();

	useEffect(() => {
		if (blocker.state === "blocked" && !isBlocked) {
			blocker.reset();
		}
	}, [blocker, isBlocked]);

	return (
		<Modal isOpen={blocker.state === "blocked"}>
			<Lottie
				className="w-23 h-23 mb-8 rounded-full bg-black"
				animationData={animation}
				loop={false}
			/>
			<div className="max-w-[21rem]">
				<h3 className="typo-h3">
					{heading ? heading : t("unsavedChangesHeading")}
				</h3>
				<p className="mt-5">
					{body ? body : t("unsavedChangesBody")}
				</p>
			</div>

			<div className="flex justify-end items-end mt-16 space-x-6">
				<Button
					style="secondary"
					text={t("discardChanges")}
					onClick={() => {
						if (stopNavAction) stopNavAction();
						blocker.proceed?.();
					}}
				/>
				<Button
					text={t("stay")}
					onClick={() => blocker.reset?.()}
				/>
			</div>
		</Modal>
	);
};
