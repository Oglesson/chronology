import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { BlockNavigation } from "../../../components/modal/BlockNavigation";
import { Table } from "../../../components/table/Table";
import { useProcessDefinition } from "../../../hooks.queries/useProcessDefinition";
import { useProcessDefinitionTaskFormulaCodes } from "../../../hooks.queries/useProcessDefinitionTaskFormulaCodes";
import { DefinitionContext } from "../../definition.index/partials/_DefinitionContext";
import { EditStep } from "./_EditStep";
import { RemoveStep } from "./_RemoveStep";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";
import { useSteps } from "../../../hooks.queries/useSteps";
import { usePathFeatures } from "../../../hooks.queries/usePathFeatures";
import { Tooltip } from "../../../components/common/tooltip/Tooltip";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import Icons from "../../../config.common/Icons";

export const List = () => {
	const definition = useProcessDefinition();
	const { steps } = useSteps();
	const pathFeatures = usePathFeatures();
	const {
		canSave,
		definitionStepsForPathFeatures,
		questions,
		setCanSave,
		setDefinitionStepsForPathFeatures,
		setDefinitionStepActionIndex,
		setOpenEditStepModal,
		setOpenRemoveStepModal,
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

	return (
		<>
			{(permissions?.edit || permissions?.admin) && <BlockNavigation isBlocked={canSave} />}
			{definitionStepsForPathFeatures && (
				<Table
					data={definitionStepsForPathFeatures}
					dataChange={(data) => {
						const newData = data.map((item, index) => {
							return {
								...item,
								OutputIndex: index + 1,
							};
						});
						setDefinitionStepsForPathFeatures(newData);
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
														definitionStepsForPathFeatures?.indexOf(
															data,
														),
													),
												);
												setOpenEditStepModal();
											}}
											disabled={definition.IsInUseByOp}
										>
											{t("editStep", {
												defaultValue: "Edit Step",
											})}
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
														definitionStepsForPathFeatures?.indexOf(
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
							accessor: "_Feature.Description",
							label: "Feature",
							width: "15%",
							template(data) {
								return (
									<span className="flex gap-2 items-center">
										{!pathFeatures.some(
											(feature) =>
												data?.FeatureID === feature.ID,
										) && (
											<Tooltip
												theme="error"
												content={t(
													"tooltipFeatureRemovedError",
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
										{data._Feature.Description}
									</span>
								);
							},
						},
						{
							accessor: "_Step.Code",
							label: "Step",
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
										{data?.PathfeaturesStepsConditions?.map(
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
														? t("equals", {
																defaultValue:
																	"equals",
															})
														: t("doesNotEqual", {
																defaultValue:
																	"does not equal",
															})}{" "}
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
						},
					]}
					rows={{
						draggable: (permissions?.edit || permissions?.admin) && !definition.IsInUseByOp,
					}}
					tableClassName="mt-10"
				/>
			)}
			{(permissions?.edit || permissions?.admin) &&
				!definition.IsInUseByOp &&
				definitionStepsForPathFeatures &&
				definitionStepsForPathFeatures.length > 0 && <EditStep />}
			{(permissions?.edit || permissions?.admin) &&
				!definition.IsInUseByOp &&
				definitionStepsForPathFeatures &&
				definitionStepsForPathFeatures.length > 0 && <RemoveStep />}
		</>
	);
};
