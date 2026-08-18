import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/button/Button";
import { Table } from "../../../components/table/Table";
import Icons from "../../../config.common/Icons";
import { useProcessDefinition } from "../../../hooks.queries/useProcessDefinition";
import { QuestionGroupsMenu } from "../../../screens.process/process.questions/partials/_QuestionGroupsMenu";
import { QuestionsGroups } from "../../../screens.process/process.questions/partials/_QuestionsGroups";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import { PreviewQuestionsContext } from "./_PreviewQuestionsContext";

export const PreviewSteps = ({
	setOpenModal,
}: {
	setOpenModal: () => void;
}) => {
	const { previewStep, setPreviewStep, previewSteps } = useContext(
		PreviewQuestionsContext
	);
	const definition = useProcessDefinition();
	const { t } = useTranslation();

	let step;

	switch (previewStep) {
		case 0:
			step = (
				<div className="grid grid-cols-12 gap-10">
					<div className="col-span-3">
						<QuestionGroupsMenu />
					</div>
					<div className="col-span-9 pb-10">
						<QuestionsGroups />
					</div>
				</div>
			);
			break;
		case 1:
			step = (
				<>
					<div className="pt-5 pb-20">
						<Table
							tableClassName="table--border"
							columns={[
								{
									label: t("code"),
									accessor: "_Step.Code",
									template: (data) => data?._Step?.Code,
								},
								{
									label: t("description"),
									accessor: "_Step.Description",
									template: (data) =>
										data?._Step?.Description,
								},
								{
									label: t("simultaneous"),
									accessor: "Simo",
								},
								{
									label: t("frequency"),
									accessor: "Quantity",
									template: (data) =>
										data?.Quantity?.toFixed(2),
									alignHorizontal: "right",
								},
								{
									label: t("per"),
									accessor: "PerBatch",
									template: (data) =>
										`${data?.Every} ${
											data?.PerBatch
												? t("batch(es)")
												: t("item(s)")
										}`,
								},
							]}
							data={previewSteps}
						/>
					</div>
					<div
						className={
							"fixed z-20 bottom-0 overflow-hidden p-6.5 flex justify-end pointer-events-none right-0"
						}
					>
						<div className="flex items-center gap-6 pointer-events-auto">
							<button
								className="inline-block px-5 py-4 text-button text-white font-medium underline underline-offset-4 backdrop-blur-md rounded-full hover:text-opacity-70"
								type="button"
								onClick={() => {
									setPreviewStep(0);
								}}
							>
								{t("editAnswers", {
									defaultValue: "Edit Answers",
								})}
							</button>
							<Button
								type="button"
								text={t("backToProcessDefinition", {
									defaultValue:
										"Back to Process Definition",
								})}
								onClick={() => {
									setOpenModal();
								}}
							/>
						</div>
					</div>
				</>
			);
			break;
	}

	return (
		<>
			<div className="max-w-xl">
				<span className="block text-grey-light mb-1.5">
					{t("testDefinition", {
						defaultValue: "Test Definition",
					})}
				</span>
				<h2 className="typo-h2 mb-7 uppercase">{definition.Code}</h2>
				<p>
					{t("testDefinitionText", {
						defaultValue:
							"Test your Process Definition by answering the questions you have created and reviewing the resulting Steps.",
					})}
				</p>
			</div>
			<div className="flex items-center px-8 py-6 mt-12 mb-5 bg-black rounded-md">
				<span
					className={
						"text-h5" + (previewStep === 1 ? " opacity-50" : "")
					}
				>
					01 Questions
				</span>
				<RenderIcon
					icon={Icons.Interface.ArrowNext}
					classes="opacity-50 mx-5"
				/>
				<span
					className={
						"text-h5" + (previewStep === 0 ? " opacity-50" : "")
					}
				>
					02 Steps
				</span>
			</div>
			<div className="bg-background px-8 pt-8 pb-10 rounded-md translate-x-0">
				{step}
			</div>
		</>
	);
};
