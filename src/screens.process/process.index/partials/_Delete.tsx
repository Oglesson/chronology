import { useTranslation } from "react-i18next";
import { ProcessData } from "../../../api.common/types";
import { DeleteItemModal } from "../../../components/modal/DeleteItemModal";
import { useToggle } from "../../../hooks.common/useToggle";

interface DeleteProps {
	process: ProcessData | undefined;
}

export const Delete = ({ process }: DeleteProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();

	if (!process) {
		return null;
	}

	return (
		<>
			<button
				type="button"
				onClick={setOpenModal}
				disabled={process.IsInUse}
			>
				{t("deleteProcess", {
					defaultValue: "Delete Process",
				})}
				{process.IsInUse && <> ({t("inUse")})</>}
			</button>
			<DeleteItemModal
				body={t("deleteProcessSummary")}
				deletionId={process?.ID}
				heading={
					<>
						{t("deleteTheProcess", {
							defaultValue: "Delete the Process",
						})}
						<span className="block">'{process?.Code}'</span>
					</>
				}
				isOpen={openModal}
				toggleState={setOpenModal}
			/>
		</>
	);
};
