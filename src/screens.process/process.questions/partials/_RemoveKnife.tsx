import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import { useToggle } from "../../../hooks.common/useToggle";
import { QuestionsContext } from "./_QuestionsContext";

type RemoveKnifeProps = {
	index: number;
};

export const RemoveKnife = ({ index }: RemoveKnifeProps) => {
	const { knivesQuestionsState, setKnivesQuestionsState, formHasChanged } =
		useContext(QuestionsContext);
	const knife = knivesQuestionsState.value[index];
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();

	return (
		<>
			<button type="button" onClick={setOpenModal}>
				{t("removeKnife", {
					defaultValue: "Remove Knife",
				})}
			</button>
			<Modal isOpen={openModal}>
				<div className="max-w-[21rem]">
					<h3 className="typo-h3">
						Remove Knife '{knife?.Description}'?
					</h3>
					<p className="mt-5">
						Are you sure that you want to remove the Knife '
						{knife?.Description}'?
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

							setKnivesQuestionsState((previous) => {
								const next = { ...previous };

								next.value.splice(index, 1);

								return next;
							});
							formHasChanged(["Cutting", "Knives"]);

							setOpenModal();
						}}
					>
						<Button
							text={t("remove")}
							theme="decline"
							type="submit"
						/>
					</form>
				</div>
			</Modal>
		</>
	);
};
