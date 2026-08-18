import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { DeleteItemModal } from "../../components/modal/DeleteItemModal";
import { FORM_IDENTIFIERS } from "../../constants.common/formIdentifiers";
import { ProcessTypeContext } from "./_ProcessTypeContext";

export const DeleteClass = ({ ...props }) => {
	const {
		setOpenDeleteClassModal,
		deleteClassId,
		deleteClassName,
		openDeleteClassModal,
	} = useContext(ProcessTypeContext);
	const { t } = useTranslation();

	if (!deleteClassId) {
		return <></>;
	}

	return (
		<DeleteItemModal
			body={t("deleteClassSummary")}
			deletionId={deleteClassId}
			heading={
				<>
					{t("deleteTheClass")}
					<span className="block">'{deleteClassName}'</span>
				</>
			}
			identifier={FORM_IDENTIFIERS.deleteProcessClass}
			isOpen={openDeleteClassModal}
			toggleState={setOpenDeleteClassModal}
			{...props}
		/>
	);
};
