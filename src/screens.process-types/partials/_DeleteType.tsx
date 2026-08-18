import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { DeleteItemModal } from "../../components/modal/DeleteItemModal";
import { FORM_IDENTIFIERS } from "../../constants.common/formIdentifiers";
import { ProcessTypeContext } from "./_ProcessTypeContext";

export const DeleteType = ({ ...props }) => {
	const {
		setOpenDeleteTypeModal,
		deleteTypeId,
		deleteTypeName,
		openDeleteTypeModal,
	} = useContext(ProcessTypeContext);
	const { t } = useTranslation();

	if (!deleteTypeId) {
		return <></>;
	}

	return (
		<DeleteItemModal
			body={t("deleteTypeSummary")}
			deletionId={deleteTypeId}
			heading={
				<>
					{t("deleteTheType")}
					<span className="block">'{deleteTypeName}'</span>
				</>
			}
			identifier={FORM_IDENTIFIERS.deleteProcessType}
			isOpen={openDeleteTypeModal}
			toggleState={setOpenDeleteTypeModal}
			{...props}
		/>
	);
};
