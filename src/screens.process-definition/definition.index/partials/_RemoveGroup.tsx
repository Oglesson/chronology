import { UniqueIdentifier } from "@dnd-kit/core";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ProcessDefinitionQuestionGroup } from "../../../api.common/types";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import { useToggle } from "../../../hooks.common/useToggle";
import { useProcessDefinition } from "../../../hooks.queries/useProcessDefinition";
import { DefinitionContext } from "./_DefinitionContext";

interface RemoveGroupProps {
	container: UniqueIdentifier;
	groupData: ProcessDefinitionQuestionGroup | undefined;
}

export const RemoveGroup = ({
	container,
	groupData,
}: RemoveGroupProps) => {
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();
	const { items, setCanSave, setContainers, setGroups, setItems } =
		useContext(DefinitionContext);
	const definition = useProcessDefinition();

	if (!container) {
		return null;
	}

	const groupQuestions = items?.[container];

	return (
		<>
			<button
				type="button"
				onClick={setOpenModal}
				disabled={definition.IsInUseByOp}
			>
				{t("removeCategory")}
				{definition.IsInUseByOp && <> ({t("inUse")})</>}
			</button>
			<Modal isOpen={openModal}>
				<div className="max-w-[21rem]">
					<h3 className="typo-h3">
						{groupQuestions.length > 0
							? `${t("unableToRemoveCategory")} '${
									groupData?.QuestionColumnDescription
							  }'.`
							: `${t("removeCategory")} '${
									groupData?.QuestionColumnDescription
							  }'?`}
					</h3>
					<p className="mt-5">
						{groupQuestions.length > 0
							? t("unableToRemoveCategorySummary")
							: t("removeCategorySummary")}
					</p>
				</div>
				<div className="flex justify-end items-end mt-16">
					<Button
						style="secondary"
						text={t("cancel")}
						onClick={setOpenModal}
					/>
					{groupQuestions.length === 0 && (
						<form
							className="ml-6"
							onSubmit={(e) => {
								e.preventDefault();

								setContainers((previous) => {
									const next = [...previous];
									const index = next.findIndex((o) => {
										return o === container;
									});
									next.splice(index, 1);

									return next;
								});

								setItems((previous) => {
									const next = { ...previous };
									delete next[container];

									return next;
								});

								setGroups((previous) => {
									const next = [...(previous ?? [])];
									const index = next.findIndex(
										(o) => o.QuestionColumnID === container
									);
									next.splice(index, 1);
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
					)}
				</div>
			</Modal>
		</>
	);
};
