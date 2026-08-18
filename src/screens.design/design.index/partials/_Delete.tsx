import { useTranslation } from "react-i18next";
import { DesignData } from "../../../api.common/types";
import { DeleteItemModal } from "../../../components/modal/DeleteItemModal";
import { useToggle } from "../../../hooks.common/useToggle";

interface DeleteProps {
	style: DesignData | undefined;
}

export const Delete = ({ style }: DeleteProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();

	if (!style) {
		return <></>;
	}

	return (
		<>
			<button type="button" onClick={setOpenModal}>
				{t("deleteStyle", {
					defaultValue: "Delete Style",
				})}
			</button>
			<DeleteItemModal
				body={t("deleteStyleSummary")}
				deletionId={style?.ID}
				heading={
					<>
						{t("deleteTheStyle", {
							defaultValue: "Delete the Style",
						})}
						<span className="block">'{style?.Code}'</span>
					</>
				}
				isOpen={openModal}
				toggleState={setOpenModal}
			/>
		</>
	);
};
