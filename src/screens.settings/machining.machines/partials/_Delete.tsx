import { useTranslation } from "react-i18next";
import { MachineData } from "../../../api.common/types";
import { DeleteItemModal } from "../../../components/modal/DeleteItemModal";
import { FORM_IDENTIFIERS } from "../../../constants.common/formIdentifiers";
import { useToggle } from "../../../hooks.common/useToggle";

interface DeleteProps {
	machine: MachineData | undefined;
}

export const Delete = ({ machine }: DeleteProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();

	if (!machine) {
		return null;
	}

	return (
		<>
			<button
				type="button"
				onClick={setOpenModal}
				disabled={machine.IsInUse}
			>
				{t("deleteMachine")}
				{machine.IsInUse && <> ({t("inUse")})</>}
			</button>
			<DeleteItemModal
				body={t("deleteMachineSummary")}
				deletionId={machine.ID}
				heading={
					<>
						{t("deleteTheMachine")}
						<span className="block">'{machine.Code}'</span>
					</>
				}
				identifier={FORM_IDENTIFIERS.deleteMachine}
				isOpen={openModal}
				toggleState={setOpenModal}
			/>
		</>
	);
};
