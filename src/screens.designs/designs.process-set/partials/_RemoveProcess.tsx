import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import { useToggle } from "../../../hooks.common/useToggle";
import { ProcessSetContext } from "./_ProcessSetContext";

interface RemoveProcessProps {
	itemId: number;
}

export const RemoveProcess = ({ itemId }: RemoveProcessProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();
	const { processes, setCanSave, setProcesses } =
		useContext(ProcessSetContext);
	const index = processes.findIndex((o) => o.ProcessID === itemId);
	const process = processes[index];

	if (!process) {
		return null;
	}

	return (
		<>
			<button type="button" onClick={setOpenModal}>
				{t("removeOperation", {
					defaultValue: "Remove Process",
				})}
			</button>
			<Modal isOpen={openModal}>
				<div className="max-w-[21rem]">
					<h3 className="typo-h3">
						Remove Process '{process._Operation?.Code}'?
					</h3>
					<p className="mt-5">
						Are you sure that you want to remove the Process '
						{process._Operation?.Code}' from the Process Set?
					</p>
				</div>
				<div className="flex justify-end items-end mt-16">
					<Button
						style="secondary"
						text={t("cancel")}
						onClick={setOpenModal}
					/>
					<form
						className="ml-6"
						onSubmit={(e) => {
							e.preventDefault();
							setProcesses((previous) => {
								const next = [...previous];

								next.splice(index, 1);

								return next;
							});

							setOpenModal();
							setCanSave(true);
						}}
					>
						<Button
							text={t("remove")}
							theme="decline"
							type="submit"
						/>
					</form>
				</div>
			</Modal>
		</>
	);
};
