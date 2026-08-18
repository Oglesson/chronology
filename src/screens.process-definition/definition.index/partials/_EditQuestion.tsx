import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import {
	FieldErrorsImpl,
	useFieldArray,
	useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { ProcessDefinitionQuestionData } from "../../../api.common/types";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import Icons from "../../../config.common/Icons";
import { FormError } from "../../../forms.common/FormError";
import { Input } from "../../../forms.common/Input";
import { Label } from "../../../forms.common/Label";
import { Select, SelectOption } from "../../../forms.common/Select";
import { Textarea } from "../../../forms.common/Textarea";
import {
	useChoiceQuestionFormSchema,
	useNumberQuestionFormSchema,
} from "../../../hooks.schema/forms";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import { DefinitionContext } from "./_DefinitionContext";

type EditQuestionProps = {
	data: ProcessDefinitionQuestionData;
};

export const EditQuestion = ({ data }: EditQuestionProps) => {
	const {
		setQuestionType,
		setEditQuestionModalData,
		setOpenEditQuestionModal,
	} = useContext(DefinitionContext);
	const { t } = useTranslation();

	return (
		<button
			onClick={() => {
				setEditQuestionModalData(data);
				setQuestionType(
					data.QuestionsChoices?.length ? "choice" : "number"
				);
				setOpenEditQuestionModal();
			}}
		>
			{t("editQuestion")}
		</button>
	);
};

export const EditQuestionModal = () => {
	const getFieldValues = () => {
		return getValues();
	};

	const choiceQuestionFormSchema = useChoiceQuestionFormSchema();
	const numberQuestionFormSchema =
		useNumberQuestionFormSchema(getFieldValues);

	type ChoiceQuestionFormData = z.infer<typeof choiceQuestionFormSchema>;
	type NumberQuestionFormData = z.infer<typeof numberQuestionFormSchema>;
	type QuestionFormData = ChoiceQuestionFormData | NumberQuestionFormData;

	const {
		editQuestionModalData,
		questionType,
		openEditQuestionModal,
		setCanSave,
		setOpenEditQuestionModal,
		setQuestions,
	} = useContext(DefinitionContext);

	const {
		control,
		register,
		handleSubmit,
		reset,
		resetField,
		setValue,
		getValues,
		watch,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			choices: [
				{
					index: 0,
					value: "",
				},
			],
		},
		resolver: zodResolver(
			questionType === "choice"
				? choiceQuestionFormSchema
				: numberQuestionFormSchema
		),
	});
	const { fields, append, remove, replace } = useFieldArray({
		control,
		name: "choices",
	});
	const onSubmit = (data: QuestionFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);
	const { t } = useTranslation();

	const renderBaseQuestionFields = () => {
		return (
			<>
				<Input
					defaultValue={editQuestionModalData?.Description}
					error={errors.title}
					htmlFor={"title"}
					label={t("title")}
					name="title"
					placeholder="Enter a title..."
					register={register}
				/>
				<Textarea
					defaultValue={editQuestionModalData?.Explanation}
					error={errors.explanation}
					htmlFor={"explanation"}
					label={t("explanation")}
					name="explanation"
					placeholder="Enter an explanation..."
					register={register}
				/>
			</>
		);
	};

	const renderChoiceQuestionFields = () => {
		const choiceErrors = errors as Partial<
			FieldErrorsImpl<ChoiceQuestionFormData>
		>;
		// eslint-disable-next-line react-hooks/incompatible-library
		const defaultIndexOptions = watch("choices").reduce(function (
			filtered,
			option
		) {
			if (option.value.length) {
				filtered.push({
					label: option.value,
					value: filtered.length,
				});
			}
			return filtered;
		},
		[] as SelectOption[]);

		return (
			<>
				{renderBaseQuestionFields()}

				<div className="form-field">
					<Label htmlFor="choices" label={t("choices")} />
					{fields.map((field, index) => {
						const error = choiceErrors.choices?.[index]?.value;
						const { onBlur, onChange, name, ref } = register(
							`choices.${index}.value`
						);

						return (
							<div key={field.id} className="mb-5">
								<div className="flex items-center">
									<input
										ref={ref}
										id="choices"
										name={name}
										onBlur={onBlur}
										onChange={(event) => {
											onChange(event);
											if (
												getValues("defaultIndex") ===
													index &&
												getValues(
													`choices.${index}.value`
												).length === 0
											) {
												resetField("defaultIndex", {
													defaultValue: "",
												});
											}
										}}
										className={`form-input${
											error ? " form-input--error" : ""
										} max-w-[11.125rem]`}
										type="text"
										placeholder="Enter choice..."
										aria-invalid={error ? "true" : "false"}
									/>
									{fields.length > 1 && (
										<button
											className="text-decline ml-3.5 rounded-sm"
											type="button"
											onClick={() => {
												const defaultIndex =
													getValues("defaultIndex");

												if (defaultIndex === index) {
													resetField("defaultIndex", {
														defaultValue: "",
													});
												} else if (
													defaultIndex > index
												) {
													setValue(
														"defaultIndex",
														defaultIndex - 1
													);
												}

												remove(index);

												getValues("choices").forEach(
													(_choice, index) => {
														setValue(
															`choices.${index}.index`,
															index
														);
													}
												);
											}}
										>
											<span className="sr-only">
												{t("remove")}
											</span>
											<RenderIcon
												classes="block [:hover>&]:hidden [:focus-visible>&]:hidden"
												icon={Icons.Edit.Remove}
											/>
											<RenderIcon
												classes="hidden [:hover>&]:block [:focus-visible>&]:block"
												icon={Icons.Edit.RemoveSolid}
											/>
										</button>
									)}
								</div>
								<FormError error={error} />
							</div>
						);
					})}
					<Button
						icon={Icons.Edit.PlusSmall}
						text="Add a choice"
						type="button"
						style="tertiary"
						onClick={() => {
							append({
								index: fields.length,
								value: "",
							});
						}}
					/>
				</div>

				<Select
					control={control}
					defaultValue={
						editQuestionModalData?.DefaultIndexIfChoice || 0
					}
					htmlFor="defaultIndex"
					name="defaultIndex"
					label={t("defaultChoice")}
					options={defaultIndexOptions}
					placeholder={`
						${defaultIndexOptions.length ? "Select a choice" : "Add choices above"}...`}
					error={choiceErrors.defaultIndex}
				/>
			</>
		);
	};

	const renderNumberQuestionFields = () => {
		const numberErrors = errors as Partial<
			FieldErrorsImpl<NumberQuestionFormData>
		>;

		return (
			<>
				{renderBaseQuestionFields()}
				<div className="grid grid-cols-2 gap-x-6">
					<div className="col-span-1">
						<Input
							defaultValue={
								editQuestionModalData?.QuestionsNumbers
									?.MinValue
							}
							error={numberErrors.minValue}
							htmlFor="minValue"
							label={t("minimum")}
							name="minValue"
							register={register}
							type="number"
						/>
					</div>
					<div className="col-span-1">
						<Input
							defaultValue={
								editQuestionModalData?.QuestionsNumbers
									?.MaxValue
							}
							error={numberErrors.maxValue}
							htmlFor="maxValue"
							label={t("maximum")}
							name="maxValue"
							register={register}
							type="number"
						/>
					</div>
					<div className="col-span-1">
						<Input
							defaultValue={
								editQuestionModalData?.QuestionsNumbers
									?.DefaultValue
							}
							error={numberErrors.defaultValue}
							htmlFor="defaultValue"
							label={t("default")}
							name="defaultValue"
							register={register}
							type="number"
						/>
					</div>
					<div className="col-span-1">
						<Select
							control={control}
							defaultValue={
								editQuestionModalData?.QuestionsNumbers?.Dps
							}
							error={numberErrors.decimalPlaces}
							htmlFor="decimalPlaces"
							label={t("decimalPlaces")}
							name="decimalPlaces"
							options={[
								{
									value: 0,
								},
								{
									value: 1,
								},
								{
									value: 2,
								},
							]}
						/>
					</div>
				</div>
			</>
		);
	};

	const renderQuestionFields = () => {
		switch (questionType) {
			case "choice":
				return renderChoiceQuestionFields();
			case "number":
				return renderNumberQuestionFields();
			default:
				return <></>;
		}
	};

	useEffect(() => {
		if (openEditQuestionModal) {
			reset();
		}
	}, [openEditQuestionModal, reset]);

	useEffect(() => {
		if (
			!editQuestionModalData?.QuestionsChoices ||
			!openEditQuestionModal
		) {
			return;
		}
		replace(
			editQuestionModalData.QuestionsChoices.map((choice) => ({
				index: choice.ChoiceIndex,
				value: choice.ChoiceValue,
			}))
		);
		setValue(
			"defaultIndex",
			editQuestionModalData.DefaultIndexIfChoice || 0
		);
	}, [openEditQuestionModal, editQuestionModalData, replace, setValue]);

	return (
		<Modal isOpen={openEditQuestionModal}>
			{editQuestionModalData && (
				<>
					<h2 className="typo-h3 mb-12">
						{t("editQuestion")} '
						{editQuestionModalData?.Description}'?
					</h2>
					<form
						onSubmit={(e) => {
							if (!isValid) {
								handleSubmit(onSubmit, onSubmitError)(e);

								return;
							}

							e.preventDefault();

							setQuestions((previous) => {
								const next = [...(previous ?? [])];
								const index = next?.findIndex(
									(o) => o.Code === editQuestionModalData.Code
								);

								if (questionType === "choice") {
									const {
										title,
										explanation,
										defaultIndex,
										choices,
									} = getValues() as ChoiceQuestionFormData;

									next[index] = {
										...next[index],
										DefaultIndexIfChoice:
											Number(defaultIndex),
										Description: title.toString(),
										Explanation: explanation.toString(),
										QuestionsChoices: choices.map((v) => ({
											ChoiceIndex: v.index,
											ChoiceValue: v.value,
										})),
									};

									return next;
								}

								const {
									title,
									explanation,
									minValue,
									maxValue,
									decimalPlaces,
									defaultValue,
								} = getValues() as NumberQuestionFormData;

								next[index] = {
									...next[index],
									Description: title.toString(),
									Explanation: explanation.toString(),
									QuestionsNumbers: {
										DefaultValue: Number(defaultValue),
										Dps: Number(decimalPlaces),
										MaxValue: Number(maxValue),
										MinValue: Number(minValue),
									},
								};

								return next;
							});

							setOpenEditQuestionModal();
							setCanSave(true);
						}}
					>
						{renderQuestionFields()}
						<div className="flex justify-end items-end mt-12 gap-6">
							<Button
								style="secondary"
								text={t("cancel")}
								onClick={() => {
									setOpenEditQuestionModal();
								}}
							/>
							<Button text={t("update")} type="submit" />
						</div>
					</form>
				</>
			)}
		</Modal>
	);
};
