import { useTranslation } from "react-i18next";
import { useToggle } from "../../../hooks.common/useToggle";
import { ProcessDefinitionData } from "../../../api.common/types";
import { CopyItemModal } from "../../../components/modal/CopyItemModal";

interface CopyProps {
	definition: ProcessDefinitionData | undefined;
}

export const Copy = ({ definition }: CopyProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();

	return (
		<>
			<button type="button" onClick={setOpenModal}>
				{t("copyDefinition")}
			</button>
			<CopyItemModal
				body={t("copyDefinitionSummary")}
				copyId={definition?.ID}
				heading={
					<>
						{t("copyDefinition", {
							defaultValue: "Copy the Definition",
						})}
						<span className="block">'{definition?.Code}'</span>
					</>
				}
				isOpen={openModal}
				toggleState={setOpenModal}
				identifier={definition?.Code}
			/>
		</>
	);
};
