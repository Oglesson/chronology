import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import { GroupProcessModalDataProps } from "./_GroupProcessesQuestions";
import { QuestionsContext } from "./_QuestionsContext";

type RemoveGroupProcessProps = {
	modalData: GroupProcessModalDataProps;
	openModal: boolean;
	setOpenModal: () => void;
};

export const RemoveGroupProcess = ({
	modalData,
	openModal,
	setOpenModal,
	...props
}: RemoveGroupProcessProps) => {
	const { setGroupProcessesQuestionsState, formHasChanged } =
		useContext(QuestionsContext);
	const { t } = useTranslation();

	const { defaultValue, index } = modalData;

	return (
		<Modal isOpen={openModal} {...props}>
			<div className="max-w-[21rem]">
				<h3 className="typo-h3">
					Remove Process '{defaultValue?.Code}'?
				</h3>
				<p className="mt-5">
					Are you sure that you want to remove the Process '
					{defaultValue?.Code}'?
				</p>
			</div>
			<div className="flex justify-end items-end mt-16">
				<Button
					style="secondary"
					text={t("cancel")}
					onClick={setOpenModal}
				/>
				<form
					className="ml-6"
					onSubmit={(e) => {
						e.preventDefault();

						setGroupProcessesQuestionsState((previous) => {
							const next = [...previous];
							next[index] = {};

							return next;
						});
						formHasChanged("Group");

						setOpenModal();
					}}
				>
					<Button text={t("remove")} theme="decline" type="submit" />
				</form>
			</div>
		</Modal>
	);
};
