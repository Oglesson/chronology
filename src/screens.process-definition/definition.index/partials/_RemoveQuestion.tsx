import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import { useToggle } from "../../../hooks.common/useToggle";
import { DefinitionContext } from "./_DefinitionContext";

type RemoveQuestionProps = {
	data: unknown | undefined;
};

export const RemoveQuestion = ({ data }: RemoveQuestionProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();
	const { setCanSave, setItems, setQuestions } =
		useContext(DefinitionContext);

	if (!data) {
		return null;
	}

	return (
		<>
			<button type="button" onClick={setOpenModal}>
				{t("removeQuestion")}
			</button>
			<Modal isOpen={openModal}>
				<div className="max-w-[21rem]">
					<h3 className="typo-h3">
						{t("removeQuestion")} '{data.Description}'?
					</h3>
					<p className="mt-5">{t("removeQuestionSummary")}</p>
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

							setQuestions((previous) => {
								const next = [...(previous ?? [])];
								const index = next?.findIndex(
									(o) => o.Code === data.Code
								);
								next?.splice(index, 1);

								return [...next];
							});

							setItems((previous) => {
								const next = { ...previous };
								const questions = [
									...next[data.QuestionColumnID],
								];
								const index = questions.findIndex(
									(o) => o === data.Code
								);
								questions.splice(index, 1);
								next[data.QuestionColumnID] = questions;

								return next;
							});

							setOpenModal();
							setCanSave(true);
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
