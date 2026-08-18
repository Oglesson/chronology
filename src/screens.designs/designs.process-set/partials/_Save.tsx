import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/button/Button";
import { BlockNavigation } from "../../../components/modal/BlockNavigation";
import { Modal } from "../../../components/modal/Modal";
import Icons from "../../../config.common/Icons";
import { NotificationContext } from "../../../context.common/NotificationContext";
import animation from "../../../data.lottie/save.json";
import { useFetcher } from "../../../hooks.common/useFetcher";
import { useToggle } from "../../../hooks.common/useToggle";
import { useProcessSet } from "../../../hooks.queries/useProcessSet";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import ResponseDataUtilities from "../../../utilities.common/ResponseDataUtilities";
import { ProcessSetContext } from "./_ProcessSetContext";

export const Save = () => {
	const processSet = useProcessSet();
	const { processes, canSave, setCanSave } = useContext(ProcessSetContext);
	const [openModal, setOpenModal] = useToggle(false);
	const { processResponse } = useContext(NotificationContext);

	const { t } = useTranslation();
	const { fetcher, isFetching, responseData } = useFetcher();

	useEffect(() => {
		if (responseData?.type === "success") {
			ResponseDataUtilities.resetResponseData(responseData);
			setOpenModal();
			setCanSave(false);
		} else if (responseData?.type === "error") {
			processResponse(responseData);
			ResponseDataUtilities.resetResponseData(responseData);
		}
	}, [responseData, processResponse, setCanSave, setOpenModal]);

	if (!processSet) {
		return <></>;
	}

	return (
		<>
			<BlockNavigation isBlocked={canSave} />
			<AnimatePresence>
				{canSave && (
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{
							type: "spring",
							stiffness: 260,
							damping: 20,
						}}
						className="fixed z-100 bottom-0 right-[calc(100%-100vw)] m-4.5 overflow-hidden [scrollbar-gutter:stable]"
					>
						<Button
							text={t("saveProcesses", {
								defaultValue: "Save processes",
							})}
							onClick={setOpenModal}
						/>
					</motion.div>
				)}
			</AnimatePresence>
			<Modal isOpen={openModal}>
				<Lottie
					className="w-23 h-23 mb-8 rounded-full bg-black"
					animationData={animation}
					loop={false}
				/>
				<div className="max-w-[21rem]">
					<h3 className="typo-h3">
						{t("saveChangesTo")} '{processSet.Code}'
					</h3>
					<p className="mt-5">
						Are you sure that you want to save the changes made to
						the Processes on this Process Set?
					</p>
				</div>
				<fetcher.Form action="" method="put">
					<input
						type="hidden"
						value={JSON.stringify(processes)}
						name="processes"
					/>
					<div className="flex justify-end items-center mt-16 gap-6">
						{isFetching && (
							<RenderIcon
								classes="animate-spin-slow"
								icon={Icons.Interface.Loading}
							/>
						)}
						<Button
							disabled={isFetching}
							style="secondary"
							text={t("cancel")}
							onClick={setOpenModal}
						/>
						<Button
							disabled={isFetching}
							text={t("save")}
							type="submit"
						/>
					</div>
				</fetcher.Form>
			</Modal>
		</>
	);
};
