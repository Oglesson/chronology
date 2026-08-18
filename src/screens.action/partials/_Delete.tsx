import { useTranslation } from "react-i18next";
import { ActionData } from "../../api.common/types";
import { DeleteItemModal } from "../../components/modal/DeleteItemModal";
import { useToggle } from "../../hooks.common/useToggle";

interface DeleteProps {
	action: ActionData | undefined;
}

export const Delete = ({ action }: DeleteProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();

	if (!action) {
		return null;
	}

	const disabled = action.System || action.IsInUse;

	return (
		<>
			<button type="button" onClick={setOpenModal} disabled={disabled}>
				{t("deleteAction")}
				{disabled && <> ({action.System ? t("system") : t("inUse")})</>}
			</button>
			<DeleteItemModal
				body={t("deleteActionSummary")}
				deletionId={action.ID}
				heading={
					<>
						{t("deleteTheAction")}
						<span className="block">'{action.Code}'</span>
					</>
				}
				isOpen={openModal}
				toggleState={setOpenModal}
			/>
		</>
	);
};
