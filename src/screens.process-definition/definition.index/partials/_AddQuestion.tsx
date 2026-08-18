import { UniqueIdentifier } from "@dnd-kit/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { FieldErrorsImpl, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { ItemActionsMenu } from "../../../components/ItemActionsMenu/ItemActionsMenu";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import Icons from "../../../config.common/Icons";
import { FormError } from "../../../forms.common/FormError";
import { Input } from "../../../forms.common/Input";
import { Label } from "../../../forms.common/Label";
import { Select, SelectOption } from "../../../forms.common/Select";
import { Textarea } from "../../../forms.common/Textarea";
import { useProcessDefinition } from "../../../hooks.queries/useProcessDefinition";
import {
	useChoiceQuestionFormSchema,
	useNumberQuestionFormSchema,
} from "../../../hooks.schema/forms";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import { QuestionIdGenerator } from "../../../utilities.common/StringUtilities";
import { DefinitionContext, QuestionType } from "./_DefinitionContext";

type AddQuestionProps = {
	containerId: UniqueIdentifier;
};

export const AddQuestion = ({ containerId, ...props }: AddQuestionProps) => {
	const {
		setAddQuestionContainerId,
		setQuestionType,
		setOpenAddQuestionModal,
	} = useContext(DefinitionContext);
	const definition = useProcessDefinition();
	const { t } = useTranslation();

	const handleClick = (type: QuestionType) => {
		setAddQuestionContainerId(containerId);
		setQuestionType(type);
		setOpenAddQuestionModal();
	};

	return (
		<div className="mt-auto" {...props}>
			<ItemActionsMenu
				actions={[
					{
						step: (
							<button
								type="button"
								onClick={() => handleClick("number")}
								disabled={definition.IsInUseByOp}
							>
								{t("number")}
							</button>
						),
					},
					{
						step: (
							<button
								type="button"
								onClick={() => handleClick("choice")}
								disabled={definition.IsInUseByOp}
							>
								{t("choice")}
							</button>
						),
					},
				]}
				buttonIcon={Icons.Edit.Plus}
				buttonLabel={`${t("addQuestion")}${
					definition.IsInUseByOp ? ` (${t("inUse")})` : ""
				}`}
				style="select"
				className={
					definition.IsInUseByOp
						? "opacity-30 pointer-events-none"
						: ""
				}
				tabIndex={-1}
			/>
		</div>
	);
};

export const AddQuestionModal = () => {
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
		definitionType,
		addQuestionContainerId,
		questionType,
		openAddQuestionModal,
		questions,
		setCanSave,
		setItems,
		setOpenAddQuestionModal,
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
				: numberQuestionFormSchema,
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
					error={errors.title}
					htmlFor={"title"}
					label={t("title")}
					name="title"
					placeholder="Enter a title..."
					register={register}
				/>
				<Textarea
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
			option,
		) {
			if (option.value.length) {
				filtered.push({
					label: option.value,
					value: filtered.length,
				});
			}
			return filtered;
		}, [] as SelectOption[]);

		return (
			<>
				{renderBaseQuestionFields()}

				<div className="form-field">
					<Label htmlFor="choices" label={t("choices")} />
					{fields.map((field, index) => {
						const error = choiceErrors.choices?.[index]?.value;
						const { onBlur, onChange, name, ref } = register(
							`choices.${index}.value`,
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
													`choices.${index}.value`,
												).length === 0
											) {
												resetField("defaultIndex");
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
													resetField("defaultIndex");
												} else if (
													defaultIndex > index
												) {
													setValue(
														"defaultIndex",
														defaultIndex - 1,
													);
												}

												remove(index);

												getValues("choices").forEach(
													(_choice, index) => {
														setValue(
															`choices.${index}.index`,
															index,
														);
													},
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
						text={t("addAChoice")}
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
				<div className="grid grid-cols-2 gap-x-6 mr-4.75">
					<div className="col-span-1">
						<Input
							register={register}
							htmlFor="minValue"
							name="minValue"
							label={t("minimum")}
							type="number"
							error={numberErrors.minValue}
							placeholder={`${t("enterAValue")}...`}
						/>
					</div>
					<div className="col-span-1">
						<Input
							register={register}
							htmlFor="maxValue"
							name="maxValue"
							label={t("maximum")}
							type="number"
							error={numberErrors.maxValue}
							placeholder={`${t("enterAValue")}...`}
						/>
					</div>
					<div className="col-span-1">
						<Input
							register={register}
							htmlFor="defaultValue"
							name="defaultValue"
							label={t("default")}
							type="number"
							error={numberErrors.defaultValue}
							placeholder={`${t("enterAValue")}...`}
						/>
					</div>
					<div className="col-span-1">
						<Select
							control={control}
							htmlFor="decimalPlaces"
							name="decimalPlaces"
							label={t("decimalPlaces")}
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
								{
									value: 3,
								},
								{
									value: 4,
								},
							]}
							error={numberErrors.decimalPlaces}
							placeholder={`${t("selectAValue")}...`}
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

	const lastQuestion = questions
		? [...questions]
				.map((q) => q.Code)
				.sort((a, b) => a.length - b.length || a.localeCompare(b))
				.pop()
		: "";

	const startingNumber = lastQuestion
		? parseInt(lastQuestion.replace(/^\D+/g, ""))
		: 0;

	const idGenerator = new QuestionIdGenerator(definitionType, startingNumber);

	useEffect(() => {
		if (openAddQuestionModal) {
			replace([
				{
					index: 0,
					value: "",
				},
			]);
			reset();
		}
	}, [openAddQuestionModal, replace, reset]);

	return (
		<Modal isOpen={openAddQuestionModal}>
			<h2 className="typo-h3 mb-12">
				{questionType === "choice" && t("createAChoiceQuestion")}
				{questionType === "number" && t("createANumberQuestion")}
			</h2>
			<form
				onSubmit={(e) => {
					if (!isValid) {
						handleSubmit(onSubmit, onSubmitError)(e);

						return;
					}

					e.preventDefault();

					const questionCode = idGenerator.next();

					setQuestions((previousQuestions) => {
						if (questionType === "choice") {
							const {
								title,
								explanation,
								defaultIndex,
								choices,
							} = getValues() as ChoiceQuestionFormData;

							previousQuestions?.push({
								Code: questionCode,
								DefaultIndexIfChoice: Number(defaultIndex),
								Description: title.toString(),
								Explanation: explanation.toString(),
								QuestionColumnID: Number(
									addQuestionContainerId,
								),
								QuestionsChoices: choices.map((v) => ({
									ChoiceIndex: v.index,
									ChoiceValue: v.value,
								})),
								QuestionsNumbers: null,
							});

							return previousQuestions;
						}

						const {
							title,
							explanation,
							minValue,
							maxValue,
							decimalPlaces,
							defaultValue,
						} = getValues() as NumberQuestionFormData;

						previousQuestions?.push({
							Code: questionCode,
							DefaultIndexIfChoice: null,
							Description: title.toString(),
							Explanation: explanation.toString(),
							QuestionColumnID: Number(addQuestionContainerId),
							QuestionsChoices: null,
							QuestionsNumbers: {
								DefaultValue: Number(defaultValue),
								Dps: Number(decimalPlaces),
								MaxValue: Number(maxValue),
								MinValue: Number(minValue),
							},
						});

						return previousQuestions;
					});

					setItems((previousItems) => {
						if (addQuestionContainerId) {
							previousItems[
								addQuestionContainerId.toString()
							].push(questionCode);
						}
						return previousItems;
					});

					setOpenAddQuestionModal();
					setCanSave(true);
				}}
			>
				{renderQuestionFields()}
				<div className="flex justify-end items-end mt-12 gap-6">
					<Button
						style="secondary"
						text={t("cancel")}
						onClick={() => {
							setOpenAddQuestionModal();
						}}
					/>
					<Button text={t("create")} type="submit" />
				</div>
			</form>
		</Modal>
	);
};
