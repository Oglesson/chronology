import { useTranslation } from "react-i18next";
import { ActionData } from "../../api.common/types";
import { CopyItemModal } from "../../components/modal/CopyItemModal";
import { useToggle } from "../../hooks.common/useToggle";

interface CopyProps {
	action: ActionData | undefined;
}

export const Copy = ({ action }: CopyProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();

	return (
		<>
			<button type="button" onClick={setOpenModal}>
				{t("copyAction")}
			</button>
			<CopyItemModal
				body={t("copyActionsSummary")}
				copyId={action?.ID}
				heading={
					<>
						{t("copyAction", {
							defaultValue: "Copy the Action",
						})}
						<span className="block">'{action?.Code}'</span>
					</>
				}
				isOpen={openModal}
				toggleState={setOpenModal}
				identifier={action?.Code}
			/>
		</>
	);
};
