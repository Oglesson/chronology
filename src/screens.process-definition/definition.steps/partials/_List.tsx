import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { BlockNavigation } from "../../../components/modal/BlockNavigation";
import { Table } from "../../../components/table/Table";
import Icons from "../../../config.common/Icons";
import { useProcessDefinition } from "../../../hooks.queries/useProcessDefinition";
import { useProcessDefinitionTaskFormulaCodes } from "../../../hooks.queries/useProcessDefinitionTaskFormulaCodes";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import { DefinitionContext } from "../../definition.index/partials/_DefinitionContext";
import { EditStep } from "./_EditStep";
import { RemoveStep } from "./_RemoveStep";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";
import { useSteps } from "../../../hooks.queries/useSteps";
import { Tooltip } from "../../../components/common/tooltip/Tooltip";

export const List = () => {
	const definition = useProcessDefinition();
	const { steps } = useSteps();
	const {
		canSave,
		definitionSteps,
		innerIndex,
		questions,
		setCanSave,
		setDefinitionSteps,
		setDefinitionStepActionIndex,
		setOpenEditStepModal,
		setOpenRemoveStepModal,
		setInnerIndex,
	} = useContext(DefinitionContext);
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();

	const formulaCodes = useProcessDefinitionTaskFormulaCodes();

	const getQuestion = (code: string) => {
		return questions?.find((question) => question.Code === code);
	};

	const getDescription = (code: string) => {
		const description = getQuestion(code)?.Description;
		return description ? `'${description}'` : undefined;
	};

	const getAnswer = (code: string, choiceIndex: number) => {
		const question = getQuestion(code);
		const answer = question?.QuestionsChoices?.find((choice) => {
			return choice.ChoiceIndex === choiceIndex;
		})?.ChoiceValue;
		return answer ? `'${answer}'` : undefined;
	};

	const replaceCode = (value: string | undefined) => {
		return value?.replace(/(G|H|M|T)\d+/g, (r) => {
			const description = [...(questions || []), ...(formulaCodes || [])]
				?.find((question) => question.Code === r)
				?.Description.replace("*_", "");
			return description ? `'${description}'` : r;
		});
	};

	const renderInnerIndexIndicatorText = (outputIndex: number | undefined) => {
		if (definition.IsInUseByOp || !(permissions?.edit || permissions?.admin)) {
			return definition.Handling ? t("task") : t("path");
		}

		if (innerIndex === outputIndex) {
			return definition.Handling ? t("removeTask") : t("removePath");
		}

		return definition.Handling ? t("addTask") : t("addPath");
	};

	return (
		<>
			{(permissions?.edit || permissions?.admin) && <BlockNavigation isBlocked={canSave} />}
			{definitionSteps && (
				<Table
					data={definitionSteps}
					dataChange={(data) => {
						const newData = data.map((item, index) => {
							return {
								...item,
								OutputIndex: index + 1,
							};
						});
						setDefinitionSteps(newData);
						setCanSave(true);
					}}
					actions={(data) => {
						if (!(permissions?.edit || permissions?.admin)) {
							return {};
						}

						return {
							menu: [
								{
									step: (
										<button
											type="button"
											onClick={() => {
												setDefinitionStepActionIndex(
													Number(
														definitionSteps?.indexOf(
															data,
														),
													),
												);
												setOpenEditStepModal();
											}}
											disabled={definition.IsInUseByOp}
										>
											{t("editStep")}
											{definition.IsInUseByOp && (
												<> ({t("inUse")})</>
											)}
										</button>
									),
								},
								{
									step: (
										<button
											type="button"
											onClick={() => {
												setDefinitionStepActionIndex(
													Number(
														definitionSteps?.indexOf(
															data,
														),
													),
												);
												setOpenRemoveStepModal();
											}}
											disabled={definition.IsInUseByOp}
										>
											{t("removeStep")}
											{definition.IsInUseByOp && (
												<> ({t("inUse")})</>
											)}
										</button>
									),
								},
							],
						};
					}}
					columns={[
						{
							accessor: "_Step.Code",
							label: t("code"),
							width: "15%",
							template(data) {
								return (
									<span className="flex gap-2 items-center">
										{!steps.some(
											(step) => data?.StepID === step.ID,
										) && (
											<Tooltip
												theme="error"
												content={t(
													"tooltipStepRemovedError",
												)}
											>
												<RenderIcon
													icon={
														Icons.Interface.Warning
													}
													classes="text-decline"
												/>
											</Tooltip>
										)}
										{data._Step.Code}
									</span>
								);
							},
						},
						{ accessor: "Simo", label: t("simultaneous") },
						{
							label: t("conditions"),
							template: (data) => {
								return (
									<span>
										{data?.StepsConditions?.map(
											(c, index) => (
												<span
													key={`${c.Code} ${
														c.IsEqual ? "=" : "<>"
													} ${c.CodeValueIndex}`}
												>
													{index > 0 ? " & " : ""}
													{getDescription(
														c.Code,
													)}{" "}
													{c.IsEqual
														? t("equals")
														: t(
																"doesNotEqual",
															)}{" "}
													{getAnswer(
														c.Code,
														c.CodeValueIndex,
													)}
												</span>
											),
										)}
									</span>
								);
							},
						},
						{
							label: t("extraConditions"),
							template: (data) => {
								return replaceCode(data.ExtraConditions);
							},
						},
						{
							label: t("frequencyFormula"),
							template: (data) => {
								return replaceCode(data.FreqFormula);
							},
						},
						{
							label: t("per"),
							template: (data) => {
								return replaceCode(data.EveryFormula);
							},
							alignHorizontal: "right",
						},
						{
							label: t("perBatch"),
							template: (data) => {
								return data.PerBatch ? t("yes") : t("no");
							},
						},
					]}
					rows={{
						draggable: (permissions?.edit || permissions?.admin) && !definition.IsInUseByOp,
						around: (_row, { index, sorting }) => {
							const outputIndex = index + 1;

							const isDisabled =
								innerIndex !== undefined &&
								innerIndex > -1 &&
								innerIndex !== outputIndex;

							return (
								<tbody>
									<tr
										onKeyDown={(event) => {
											event.stopPropagation();
										}}
										onPointerDown={(event) => {
											event.stopPropagation();
										}}
										className={`relative ${
											sorting ? "z-0" : "z-40"
										}`}
									>
										<td colSpan={7}>
											<button
												className={`relative flex justify-end w-full transition-opacity duration-100 ${
													innerIndex === outputIndex
														? "opacity-100"
														: "opacity-0"
												} before:absolute before:top-1/2 before:inset-x-0 before:border-t before:border-t-grey-mid${
													definition.IsInUseByOp ||
													!permissions
														.operationdefinitions
														?.edit ||
													isDisabled
														? "ease-none invisible"
														: " ease-hover hover:opacity-100 focus-visible:opacity-100"
												}`}
												type="button"
												disabled={
													isDisabled ||
													definition.IsInUseByOp ||
													!permissions
														.operationdefinitions
														?.edit
												}
												onClick={(event) => {
													event.preventDefault();
													setInnerIndex(
														innerIndex ===
															outputIndex
															? undefined
															: outputIndex,
													);
													setCanSave(true);
												}}
											>
												<span className="relative -my-2 button button--tertiary button--solid button--has-icon">
													{permissions
														.operationdefinitions
														?.edit &&
														!definition.IsInUseByOp && (
															<RenderIcon
																icon={
																	innerIndex ===
																	outputIndex
																		? Icons
																				.Edit
																				.Minus
																		: Icons
																				.Edit
																				.PlusSmall
																}
																classes="button__icon"
															/>
														)}
													{renderInnerIndexIndicatorText(
														outputIndex,
													)}
												</span>
											</button>
										</td>
									</tr>
								</tbody>
							);
						},
					}}
					tableClassName="mt-10"
				/>
			)}
			{(permissions?.edit || permissions?.admin) &&
				!definition.IsInUseByOp &&
				definitionSteps &&
				definitionSteps.length > 0 && <EditStep />}
			{(permissions?.edit || permissions?.admin) &&
				!definition.IsInUseByOp &&
				definitionSteps &&
				definitionSteps.length > 0 && <RemoveStep />}
		</>
	);
};
