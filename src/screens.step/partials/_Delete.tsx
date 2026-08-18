import { useTranslation } from "react-i18next";
import { StepData } from "../../api.common/types";
import { DeleteItemModal } from "../../components/modal/DeleteItemModal";
import { useToggle } from "../../hooks.common/useToggle";

interface DeleteProps {
	step: StepData | undefined;
}

export const Delete = ({ step }: DeleteProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();

	if (!step) {
		return <></>;
	}

	const disabled = step.Machining || step.IsInUse;

	return (
		<>
			<button type="button" onClick={setOpenModal} disabled={disabled}>
				{t("deleteStep")}
				{disabled && (
					<> ({step.Machining ? t("machining") : t("inUse")})</>
				)}
			</button>
			<DeleteItemModal
				body={t("deleteStepSummary")}
				deletionId={step.ID}
				heading={
					<>
						{t("deleteTheStep")}
						<span className="block">'{step.Code}'</span>
					</>
				}
				isOpen={openModal}
				toggleState={setOpenModal}
			/>
		</>
	);
};
