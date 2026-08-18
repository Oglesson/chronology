import { useTranslation } from "react-i18next";
import { StitchingModifierData } from "../../../api.common/types";
import { DeleteItemModal } from "../../../components/modal/DeleteItemModal";
import { FORM_IDENTIFIERS } from "../../../constants.common/formIdentifiers";
import { useToggle } from "../../../hooks.common/useToggle";

interface DeleteProps {
	stitchingModifier: StitchingModifierData | undefined;
}

export const Delete = ({ stitchingModifier }: DeleteProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();

	if (!stitchingModifier) {
		return null;
	}

	return (
		<>
			<button
				type="button"
				onClick={setOpenModal}
				disabled={stitchingModifier.IsInUse}
			>
				{t("deleteStitchingModifier")}
				{stitchingModifier.IsInUse && <> ({t("inUse")})</>}
			</button>
			<DeleteItemModal
				identifier={FORM_IDENTIFIERS.deleteStitchingModifier}
				body={t("deleteStitchingOperationSummary")}
				deletionId={stitchingModifier.ID}
				heading={
					<>
						{t("deleteTheStitchingOperation")}
						<span className="block">
							'{stitchingModifier.Description}'
						</span>
					</>
				}
				isOpen={openModal}
				toggleState={setOpenModal}
			/>
		</>
	);
};
