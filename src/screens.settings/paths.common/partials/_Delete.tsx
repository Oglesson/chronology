import { useTranslation } from "react-i18next";
import { PathFeatureData } from "../../../api.common/types";
import { DeleteItemModal } from "../../../components/modal/DeleteItemModal";
import { useToggle } from "../../../hooks.common/useToggle";

interface DeleteProps {
	pathFeature: PathFeatureData | undefined;
}

export const Delete = ({ pathFeature }: DeleteProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();

	if (!pathFeature) {
		return null;
	}

	const disabled = pathFeature.IsInUse || pathFeature.System;

	return (
		<>
			<button type="button" onClick={setOpenModal} disabled={disabled}>
				{t("deletePathFeature")}
				{disabled && (
					<> ({pathFeature.System ? t("system") : t("inUse")})</>
				)}
			</button>
			<DeleteItemModal
				body={t("deletePathFeatureSummary")}
				deletionId={pathFeature.ID}
				heading={
					<>
						{t("deleteThePathFeature")}
						<span className="block">
							'{pathFeature.Description}'
						</span>
					</>
				}
				isOpen={openModal}
				toggleState={setOpenModal}
			/>
		</>
	);
};
