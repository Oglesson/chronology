import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import { useToggle } from "../../../hooks.common/useToggle";
import { QuestionsContext } from "./_QuestionsContext";

type RemoveAdditionalStepProps = {
	index: number;
};

export const RemoveAdditionalStep = ({
	index,
}: RemoveAdditionalStepProps) => {
	const {
		additionalStepsQuestionsState,
		setAdditionalStepsQuestionsState,
		formHasChanged,
	} = useContext(QuestionsContext);
	const step = additionalStepsQuestionsState.value[index];
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();

	return (
		<>
			<button type="button" onClick={setOpenModal}>
				{t("removeAdditionalStep", {
					defaultValue: "Remove Step",
				})}
			</button>
			<Modal isOpen={openModal}>
				<div className="max-w-[21rem]">
					<h3 className="typo-h3">
						Remove Step '{step?._Step?.Code}'?
					</h3>
					<p className="mt-5">
						Are you sure that you want to remove the Step '
						{step?._Step?.Code}'?
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

							setAdditionalStepsQuestionsState((previous) => {
								const next = { ...previous };

								next.value.splice(index, 1);

								return next;
							});

							formHasChanged("AdditionalSteps");

							setOpenModal();
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
