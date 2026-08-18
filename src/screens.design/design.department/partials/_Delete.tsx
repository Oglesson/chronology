import { useTranslation } from "react-i18next";
import { DesignDepartmentData } from "../../../api.common/types";
import { DeleteItemModal } from "../../../components/modal/DeleteItemModal";
import { useToggle } from "../../../hooks.common/useToggle";

interface DeleteProps {
	styleDepartment: DesignDepartmentData | undefined;
}

export const Delete = ({ styleDepartment }: DeleteProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();

	if (!styleDepartment) {
		return <></>;
	}

	return (
		<>
			<button type="button" onClick={setOpenModal}>
				{t("deleteDesignDepartment", {
					defaultValue: "Delete Style Department",
				})}
			</button>
			<DeleteItemModal
				body={t("deleteDesignDepartmentSummary")}
				deletionId={styleDepartment?.ID}
				parentId={styleDepartment?.DesignID}
				heading={
					<>
						{t("deleteTheDesignDepartment", {
							defaultValue: "Delete the Style Department",
						})}
						<span className="block">
							'{styleDepartment._Department?.Description}'
						</span>
					</>
				}
				isOpen={openModal}
				toggleState={setOpenModal}
			/>
		</>
	);
};
