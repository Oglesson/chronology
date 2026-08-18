import { useTranslation } from "react-i18next";
import { StepData } from "../../api.common/types";
import { CopyItemModal } from "../../components/modal/CopyItemModal";
import { useToggle } from "../../hooks.common/useToggle";

interface CopyProps {
	step: StepData | undefined;
}

export const Copy = ({ step }: CopyProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();

	return (
		<>
			<button type="button" onClick={setOpenModal}>
				{t("copyStep")}
			</button>
			<CopyItemModal
				body={t("copyStepSummary")}
				copyId={step?.ID}
				heading={
					<>
						{t("copyStep", {
							defaultValue: "Copy the Step",
						})}
						<span className="block">'{step?.Code}'</span>
					</>
				}
				isOpen={openModal}
				toggleState={setOpenModal}
				identifier={step?.Code}
			/>
		</>
	);
};
