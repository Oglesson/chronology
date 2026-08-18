import { useTranslation } from "react-i18next";
import { ProcessDefinitionData } from "../../../api.common/types";
import { DeleteItemModal } from "../../../components/modal/DeleteItemModal";
import { useToggle } from "../../../hooks.common/useToggle";

interface DeleteProps {
	definition: ProcessDefinitionData | undefined;
}

export const Delete = ({ definition }: DeleteProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();

	const disabled = !!(
		definition?.OccasionsUsed && definition?.OccasionsUsed > 0
	);

	// if (disabled) {
	// 	return <></>;
	// }

	return (
		<>
			<button type="button" onClick={setOpenModal} disabled={disabled}>
				{t("deleteDefinition")}
				{disabled && <> ({t("inUse")})</>}
			</button>
			<DeleteItemModal
				body={t("deleteDefinitionSummary")}
				deletionId={definition?.ID}
				heading={
					<>
						{t("deleteTheDefinition")}
						<span className="block">'{definition?.Code}'</span>
					</>
				}
				isOpen={openModal}
				toggleState={setOpenModal}
			/>
		</>
	);
};
