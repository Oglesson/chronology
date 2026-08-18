import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import {
	useFieldArray,
	useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import {
	StepData,
	ProcessDefinitionStepData,
} from "../../../api.common/types";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import Icons from "../../../config.common/Icons";
import { AutoComplete } from "../../../forms.common/AutoComplete";
import { CheckableList } from "../../../forms.common/CheckableList";
import { ContentEditable } from "../../../forms.common/ContentEditable";
import { Label } from "../../../forms.common/Label";
import { Select, SelectOption } from "../../../forms.common/Select";
import { useSteps } from "../../../hooks.queries/useSteps";
import { useProcessDefinitionTaskFormulaCodes } from "../../../hooks.queries/useProcessDefinitionTaskFormulaCodes";
import { useDefinitionStepFormSchema } from "../../../hooks.schema/forms";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import { DefinitionContext } from "../../definition.index/partials/_DefinitionContext";

export const EditStep = () => {
	const definitionStepFormSchema = useDefinitionStepFormSchema();
	type DefinitionStepFormData = z.infer<
		typeof definitionStepFormSchema
	>;

	const {
		definitionSteps,
		setDefinitionSteps,
		definitionStepActionIndex,
		setDefinitionStepActionIndex,
		openEditStepModal,
		openRemoveStepModal,
		setOpenEditStepModal,
		setCanSave,
		questions,
	} = useContext(DefinitionContext);
	const { nonMachiningSteps } = useSteps();
	const { t } = useTranslation();
	const [definitionStep, setDefinitionStep] =
		useState<ProcessDefinitionStepData | null>(null);

	const {
		control,
		formState: { errors, isValid },
		getValues,
		handleSubmit,
		register,
		reset,
	} = useForm({
		defaultValues: {
			stepsConditions: [{}],
		},
		resolver: zodResolver(definitionStepFormSchema),
	});

	const { fields, append, remove, replace, update } = useFieldArray({
		control,
		name: "stepsConditions",
	});

	const onSubmit = (data: DefinitionStepFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	const [indexOptions, setIndexOptions] = useState<SelectOption[][]>([]);

	const formulaCodes = useProcessDefinitionTaskFormulaCodes();

	const contentEditableOptions =
		questions?.reduce((a: SelectOption[], q) => {
			if (q.QuestionsNumbers !== null) {
				a.push({
					label: q.Description,
					value: q.Code,
				});
			}
			return a;
		}, []) ?? [];

	formulaCodes?.forEach((c) =>
		contentEditableOptions.push({
			label: c.Description.replace("*_", ""),
			value: c.Code,
		})
	);

	useEffect(() => {
		if (definitionSteps && definitionStepActionIndex !== null) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setDefinitionStep(
				definitionSteps[Number(definitionStepActionIndex)]
			);
		}
	}, [definitionStepActionIndex, definitionSteps]);

	useEffect(() => {
		if (openEditStepModal) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setIndexOptions([]);
			reset();
		}
	}, [openEditStepModal, reset]);

	useEffect(() => {
		if (!definitionStep?.StepsConditions?.length) {
			return;
		}

		const conditions: DefinitionStepFormData["stepsConditions"] = [];
		const options: typeof indexOptions = [];

		definitionStep.StepsConditions.forEach((condition) => {
			const question = questions?.find(
				(question) => question.Code === condition.Code
			);
			if (question?.QuestionsChoices?.length) {
				conditions.push({
					code: condition.Code,
					index: condition.CodeValueIndex,
					isEqual: condition.IsEqual,
				});
				options.push(
					question.QuestionsChoices.map((choice) => ({
						label: choice.ChoiceValue,
						value: choice.ChoiceIndex,
					}))
				);
			}
		});

		replace(conditions);
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIndexOptions(options);
	}, [definitionStep, questions, replace]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setDefinitionStep(null);
	}, [openRemoveStepModal]);

	if (!definitionSteps?.length) {
		return <></>;
	}

	return (
		<Modal isOpen={openEditStepModal} width="w-[52rem]">
			{definitionStep && (
				<>
					<h2 className="typo-h3 mb-12">{t("editStep")}</h2>
					<form
						onSubmit={(e) => {
							if (!isValid) {
								handleSubmit(onSubmit, onSubmitError)(e);

								return;
							}

							e.preventDefault();
							const {
								step,
								stepsConditions,
								everyFormula,
								extraConditions,
								freqFormula,
								perBatch,
								simo,
							} = getValues() as DefinitionStepFormData;

							setDefinitionSteps((previous) => {
								const stepData: StepData = JSON.parse(
									step.toString()
								);

								const index = Number(
									definitionStepActionIndex
								);

								const next = [...(previous || [])];

								next[index] = {
									...next[index],
									_Step: stepData,
									StepID: stepData.ID,
									PerBatch: perBatch === "yes",
									Simo: simo === "0" ? null : Number(simo),
									StepsConditions: stepsConditions
										.filter(
											(item) =>
												Object.values(item).findIndex(
													(v) => v !== undefined
												) !== -1
										)
										.map((v) => ({
											Code: v.code,
											CodeValueIndex: v.index,
											IsEqual: v.isEqual,
										})),
									EveryFormula: everyFormula,
									FreqFormula: freqFormula,
									ExtraConditions: extraConditions,
								};

								return next;
							});

							setOpenEditStepModal();
							setCanSave(true);
							setDefinitionStepActionIndex(null);
							setDefinitionStep(null);
						}}
					>
						<div className="max-w-[23.5rem]">
							<AutoComplete
								key={`step-${definitionStep._Step?.Code}`}
								control={control}
								defaultValue={definitionStep._Step}
								error={errors.step}
								htmlFor={"step"}
								label={t("code")}
								name="step"
								options={nonMachiningSteps}
								optionLabelKeys="Code"
							/>
						</div>
						<div className="form-field">
							<Label
								htmlFor="stepsConditions"
								label={t("stepsConditions")}
							/>
							{fields.map((field, index) => {
								return (
									<div key={field.id} className="mb-5">
										<div className="flex items-start gap-x-3.5">
											<div className="flex items-start w-full gap-x-3.5 [&_label]:sr-only [&_.form-field]:mt-0">
												<div className="w-1/3">
													<Select
														control={control}
														name={`stepsConditions.${index}.code`}
														error={
															errors
																.stepsConditions?.[
																index
															]?.code
														}
														htmlFor={`stepsConditions.${index}.code`}
														label={t("code")}
														onChange={(
															_event,
															value
														) => {
															const question =
																questions?.find(
																	(
																		question
																	) =>
																		question.Code ===
																		value
																);
															const options =
																question?.QuestionsChoices?.map(
																	(
																		choice
																	) => ({
																		label: choice.ChoiceValue,
																		value: choice.ChoiceIndex,
																	})
																) ?? [];
															setIndexOptions(
																(previous) => {
																	const next =
																		[
																			...previous,
																		];
																	next[
																		index
																	] = options;
																	return next;
																}
															);
															update(index, {
																...getValues(
																	`stepsConditions.${index}`
																),
																index: undefined as unknown as number,
															});
														}}
														options={
															questions?.reduce(
																(
																	a: SelectOption[],
																	q
																) => {
																	if (
																		q
																			.QuestionsChoices
																			?.length
																	) {
																		a.push({
																			label: q.Description,
																			value: q.Code,
																		});
																	}
																	return a;
																},
																[]
															) ?? []
														}
														placeholder="Select a question..."
													/>
												</div>
												<div className="w-1/3">
													<Select
														control={control}
														name={`stepsConditions.${index}.isEqual`}
														error={
															errors
																.stepsConditions?.[
																index
															]?.isEqual
														}
														htmlFor={`stepsConditions.${index}.isEqual`}
														label={t("equals")}
														options={[
															{
																label: "Equals",
																value: true,
															},
															{
																label: "Does not equal",
																value: false,
															},
														]}
														placeholder="Select..."
													/>
												</div>
												<div className="w-1/3">
													<Select
														control={control}
														name={`stepsConditions.${index}.index`}
														error={
															errors
																.stepsConditions?.[
																index
															]?.index
														}
														htmlFor={`stepsConditions.${index}.index`}
														label={t("answer")}
														options={
															indexOptions[
																index
															] ?? []
														}
														placeholder={
															indexOptions[index]
																?.length
																? "Select an answer..."
																: "Select a question first..."
														}
													/>
												</div>
											</div>
											<button
												className={`text-decline rounded-sm mt-1.5 py-1 ${
													fields.length === 1
														? "invisible"
														: ""
												}`}
												disabled={fields.length === 1}
												type="button"
												onClick={() => {
													remove(index);
												}}
											>
												<span className="sr-only">
													{t("remove")}
												</span>
												<RenderIcon
													classes={`block ${
														fields.length > 1
															? "[:hover>&]:hidden [:focus-visible>&]:hidden"
															: ""
													}`}
													icon={Icons.Edit.Remove}
												/>
												{fields.length > 1 && (
													<RenderIcon
														classes="hidden [:hover>&]:block [:focus-visible>&]:block"
														icon={
															Icons.Edit
																.RemoveSolid
														}
													/>
												)}
											</button>
										</div>
									</div>
								);
							})}
							<Button
								icon={Icons.Edit.PlusSmall}
								text="Add a condition"
								type="button"
								style="tertiary"
								onClick={() => {
									append({
										code: undefined,
										index: undefined,
										isEqual: undefined,
									} as unknown as Parameters<typeof append>[0]);
								}}
							/>
						</div>
						<ContentEditable
							control={control}
							defaultValue={definitionStep.ExtraConditions}
							htmlFor="extraConditions"
							name="extraConditions"
							label={t("extraConditions")}
							error={errors.extraConditions}
							options={contentEditableOptions}
							placeholder="Add an extra condition..."
						/>

						<ContentEditable
							control={control}
							defaultValue={definitionStep.FreqFormula}
							htmlFor="freqFormula"
							name="freqFormula"
							label={t("frequencyFormula")}
							error={errors.freqFormula}
							options={contentEditableOptions}
							placeholder="Add a formula..."
						/>

						<div className="flex items-start w-full gap-x-3.5">
							<div className="w-1/4">
								<ContentEditable
									control={control}
									defaultValue={
										definitionStep.EveryFormula
									}
									htmlFor="everyFormula"
									name="everyFormula"
									error={errors.everyFormula}
									options={contentEditableOptions}
									placeholder="Add a formula..."
								/>
							</div>
							<div className="w-1/3">
								<Select
									control={control}
									name="perBatch"
									error={errors.perBatch}
									htmlFor="perBatch"
									label={t("per")}
									options={[
										{
											label: "Item",
											value: "no",
										},
										{
											label: "Batch",
											value: "yes",
										},
									]}
									defaultValue={
										definitionStep.PerBatch
											? "yes"
											: "no"
									}
									placeholder="-"
									horizontal
								/>
							</div>
						</div>
						<CheckableList
							error={errors.simo}
							label={t("simultaneous")}
							items={[
								{
									htmlFor: "no",
									label: t("no"),
									name: "simo",
									value: 0,
									isDefault: !definitionStep.Simo,
								},
								{
									htmlFor: "simo1",
									label: t("1"),
									name: "simo",
									value: 1,
									isDefault: definitionStep.Simo === 1,
								},
								{
									htmlFor: "simo2",
									label: t("2"),
									name: "simo",
									value: 2,
									isDefault: definitionStep.Simo === 2,
								},
							]}
							register={register}
							type="radio"
							horizontal
						/>
						<div className="flex justify-end items-end mt-12 gap-6">
							<Button
								style="secondary"
								text={t("cancel")}
								onClick={() => {
									setOpenEditStepModal();
									setDefinitionStepActionIndex(null);
									setDefinitionStep(null);
								}}
							/>
							<Button text={t("edit")} type="submit" />
						</div>
					</form>
				</>
			)}
		</Modal>
	);
};
