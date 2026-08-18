import { useTranslation } from "react-i18next";
import { useToggle } from "../../../hooks.common/useToggle";
import { DesignData } from "../../../api.common/types";
import { CopyItemModal } from "../../../components/modal/CopyItemModal";

interface CopyProps {
	style: DesignData | undefined;
}

export const Copy = ({ style }: CopyProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();

	return (
		<>
			<button type="button" onClick={setOpenModal}>
				{t("copyDesign")}
			</button>
			<CopyItemModal
				body={t("copyDesignSummary")}
				copyId={style?.ID}
				heading={
					<>
						{t("copyDesign", {
							defaultValue: "Copy the Style",
						})}
						<span className="block">'{style?.Code}'</span>
					</>
				}
				isOpen={openModal}
				toggleState={setOpenModal}
				identifier={style?.Code}
			/>
		</>
	);
};
