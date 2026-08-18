import { useTranslation } from "react-i18next";
import { DepartmentData } from "../../../api.common/types";
import { DeleteItemModal } from "../../../components/modal/DeleteItemModal";
import { useToggle } from "../../../hooks.common/useToggle";

interface DeleteProps {
	department: DepartmentData | undefined;
}

export const Delete = ({ department }: DeleteProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();

	if (!department) {
		return null;
	}

	return (
		<>
			<button
				type="button"
				onClick={setOpenModal}
				disabled={department.IsInUse}
			>
				{t("deleteDepartment")}
				{department.IsInUse && <> ({t("inUse")})</>}
			</button>
			<DeleteItemModal
				body={t("deleteDepartmentSummary")}
				deletionId={department.ID}
				heading={
					<>
						{t("deleteTheDepartment")}
						<span className="block">
							{department.Description
								? `'${department.Description}'`
								: `${t("number")} ${department.No}`}
						</span>
					</>
				}
				isOpen={openModal}
				toggleState={setOpenModal}
			/>
		</>
	);
};
