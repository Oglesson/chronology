import { useTranslation } from "react-i18next";
import { useToggle } from "../../../hooks.common/useToggle";
import { ProcessData } from "../../../api.common/types";
import { CopyItemModal } from "../../../components/modal/CopyItemModal";

interface CopyProps {
	process: ProcessData | undefined;
}

export const Copy = ({ process }: CopyProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();

	return (
		<>
			<button type="button" onClick={setOpenModal}>
				{t("copyProcess")}
			</button>
			<CopyItemModal
				body={t("copyProcessSummary")}
				copyId={process?.ID}
				heading={
					<>
						{t("copyProcess", {
							defaultValue: "Copy the Process",
						})}
						<span className="block">'{process?.Code}'</span>
					</>
				}
				isOpen={openModal}
				toggleState={setOpenModal}
				identifier={process?.Code}
			/>
		</>
	);
};
