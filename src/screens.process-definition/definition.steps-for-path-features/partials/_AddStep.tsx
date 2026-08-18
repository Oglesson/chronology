import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import {
	useFieldArray,
	useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { StepData, PathFeatureData } from "../../../api.common/types";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import Icons from "../../../config.common/Icons";
import { AutoComplete } from "../../../forms.common/AutoComplete";
import { ContentEditable } from "../../../forms.common/ContentEditable";
import { Label } from "../../../forms.common/Label";
import { Select, SelectOption } from "../../../forms.common/Select";
import { useToggle } from "../../../hooks.common/useToggle";
import { useSteps } from "../../../hooks.queries/useSteps";
import { useProcessDefinition } from "../../../hooks.queries/useProcessDefinition";
import { useProcessDefinitionTaskFormulaCodes } from "../../../hooks.queries/useProcessDefinitionTaskFormulaCodes";
import { usePathFeatures } from "../../../hooks.queries/usePathFeatures";
import { useDefinitionStepForPathFeatureFormSchema } from "../../../hooks.schema/forms";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import { DefinitionContext } from "../../definition.index/partials/_DefinitionContext";
import { CheckableList } from "../../../forms.common/CheckableList";

export const AddStep = () => {
	const [openModal, setOpenModal] = useToggle(false);
	const { steps } = useSteps();
	const pathFeatures = usePathFeatures();
	const { questions, setCanSave, setDefinitionStepsForPathFeatures } =
		useContext(DefinitionContext);
	const definition = useProcessDefinition();
	const definitionStepForPathFeatureFormSchema =
		useDefinitionStepForPathFeatureFormSchema();
	type DefinitionStepForPathFeatureFormData = z.infer<
		typeof definitionStepForPathFeatureFormSchema
	>;

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
		resolver: zodResolver(definitionStepForPathFeatureFormSchema),
	});
	const { fields, append, remove, update } = useFieldArray({
		control,
		name: "stepsConditions",
	});

	const onSubmit = (data: DefinitionStepForPathFeatureFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);
	const { t } = useTranslation();

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
		if (openModal) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setIndexOptions([]);
			reset();
		}
	}, [openModal, reset]);

	return (
		<>
			<Button
				text={
					t("addStep") +
					(definition.IsInUseByOp ? " (" + t("inUse") + ")" : "")
				}
				icon={Icons.Edit.PlusSmall}
				style="tertiary"
				onClick={setOpenModal}
				disabled={definition.IsInUseByOp}
			/>
			<Modal isOpen={openModal} width="w-[52rem]">
				<h2 className="typo-h3 mb-12">{t("addAnStep")}</h2>
				<form
					onSubmit={(e) => {
						if (!isValid) {
							handleSubmit(onSubmit, onSubmitError)(e);

							return;
						}

						e.preventDefault();

						const {
							pathFeature,
							step,
							stepsConditions,
							everyFormula,
							extraConditions,
							freqFormula,
							simo,
						} =
							getValues() as DefinitionStepForPathFeatureFormData;

						setDefinitionStepsForPathFeatures((previous) => {
							const stepData: StepData = JSON.parse(
								step.toString()
							);

							const pathFeatureData: PathFeatureData = JSON.parse(
								pathFeature.toString()
							);

							const next = [...(previous || [])];

							next?.push({
								_Feature: pathFeatureData,
								FeatureID: pathFeatureData.ID,
								_Step: stepData,
								StepID: stepData.ID,
								Simo: simo === "0" ? null : Number(simo),
								PathfeaturesStepsConditions:
									stepsConditions
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
								ID: next?.length + 1 || 1,
								OutputIndex: next?.length + 1 || 1,
							});

							return next;
						});

						setOpenModal();
						setCanSave(true);
					}}
				>
					<div className="max-w-[23.5rem]">
						<AutoComplete
							control={control}
							error={errors.pathFeature}
							htmlFor={"pathFeature"}
							label="Feature"
							name="pathFeature"
							options={pathFeatures}
							optionLabelKeys="Description"
						/>
						<AutoComplete
							control={control}
							error={errors.step}
							htmlFor={"step"}
							label="Step"
							name="step"
							options={steps}
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
																(question) =>
																	question.Code ===
																	value
															);
														const options =
															question?.QuestionsChoices?.map(
																(choice) => ({
																	label: choice.ChoiceValue,
																	value: choice.ChoiceIndex,
																})
															) ?? [];

														setIndexOptions(
															(previous) => {
																const next = [
																	...previous,
																];
																next[index] =
																	options;
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
															label: t(
																"equals"
															) as string,
															value: true,
														},
														{
															label: t(
																"doesNotEqual"
															) as string,
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
														indexOptions[index] ??
														[]
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
														Icons.Edit.RemoveSolid
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
						htmlFor="extraConditions"
						name="extraConditions"
						label={t("extraConditions")}
						error={errors.extraConditions}
						options={contentEditableOptions}
						placeholder="Add an extra condition..."
					/>
					<ContentEditable
						control={control}
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
								htmlFor="everyFormula"
								name="everyFormula"
								error={errors.everyFormula}
								options={contentEditableOptions}
								placeholder="Add a formula..."
								defaultValue="1"
							/>
						</div>
						<div className="w-1/3">
							<Select
								name="perBatchPH"
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
								defaultValue="no"
								control={control}
								horizontal
								disabled
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
								isDefault: true,
							},
							{
								htmlFor: "simo1",
								label: t("1"),
								name: "simo",
								value: 1,
							},
							{
								htmlFor: "simo2",
								label: t("2"),
								name: "simo",
								value: 2,
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
								setOpenModal();
							}}
						/>
						<Button text={t("create")} type="submit" />
					</div>
				</form>
			</Modal>
		</>
	);
};
