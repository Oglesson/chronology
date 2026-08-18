import { useTranslation } from "react-i18next";
import { GradeData } from "../../../api.common/types";
import { DeleteItemModal } from "../../../components/modal/DeleteItemModal";
import { useToggle } from "../../../hooks.common/useToggle";
import { useGeneralSettings } from "../../../hooks.queries/useGeneralSettings";

interface DeleteProps {
	grade: GradeData | undefined;
}

export const Delete = ({ grade }: DeleteProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const generalSettings = useGeneralSettings();
	const { t } = useTranslation();

	if (!grade) {
		return null;
	}

	const disabled =
		generalSettings?._DefaultGrade?.ID === grade.ID || grade.IsInUse;

	return (
		<>
			<button type="button" onClick={setOpenModal} disabled={disabled}>
				{t("deleteGrade")}
				{disabled && (
					<>
						{" "}
						(
						{generalSettings?._DefaultGrade?.ID === grade.ID
							? t("default")
							: t("inUse")}
						)
					</>
				)}
			</button>
			<DeleteItemModal
				body={t("deleteGradeSummary")}
				deletionId={grade.ID}
				heading={
					<>
						{t("deleteTheGrade")}
						<span className="block">'{grade.Code}'</span>
					</>
				}
				isOpen={openModal}
				toggleState={setOpenModal}
			/>
		</>
	);
};
