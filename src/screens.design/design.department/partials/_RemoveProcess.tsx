import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import { useToggle } from "../../../hooks.common/useToggle";
import { DesignDepartmentContext } from "./_DesignDepartmentContext";

interface RemoveProcessProps {
	itemSeq: number;
}

export const RemoveProcess = ({
	itemSeq,
}: RemoveProcessProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();
	const { styleProcesses, setCanSave, setStyleProcesses } = useContext(
		DesignDepartmentContext
	);
	const removeIndex = styleProcesses.findIndex((o) => o.Seq === itemSeq);
	const process = styleProcesses[removeIndex];

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
						{process._Operation?.Code}' from the Style Department?
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
							setStyleProcesses((previous) => {
								const next = previous.map((item, nextIndex) => {
									return {
										...item,
										Seq:
											nextIndex >= removeIndex
												? item.Seq - 1
												: item.Seq,
									};
								});

								next.splice(removeIndex, 1);

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
