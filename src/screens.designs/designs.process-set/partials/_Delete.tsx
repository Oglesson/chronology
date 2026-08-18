import { useTranslation } from "react-i18next";
import { ProcessSetData } from "../../../api.common/types";
import { DeleteItemModal } from "../../../components/modal/DeleteItemModal";
import { useToggle } from "../../../hooks.common/useToggle";

interface DeleteProps {
	processSet: ProcessSetData | undefined;
}

export const Delete = ({ processSet }: DeleteProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();

	if (!processSet) {
		return null;
	}

	return (
		<>
			<button type="button" onClick={setOpenModal}>
				{t("deleteProcessSet", {
					defaultValue: "Delete Process Set",
				})}
			</button>
			<DeleteItemModal
				body={t("deleteProcessSetSummary")}
				deletionId={processSet?.ID}
				heading={
					<>
						{t("deleteTheProcessSet", {
							defaultValue: "Delete the Process Set",
						})}
						<span className="block">'{processSet?.Code}'</span>
					</>
				}
				isOpen={openModal}
				toggleState={setOpenModal}
			/>
		</>
	);
};
