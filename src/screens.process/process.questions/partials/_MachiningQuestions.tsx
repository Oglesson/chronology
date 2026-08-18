import { zodResolver } from "@hookform/resolvers/zod";
import { FocusEvent, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FieldErrorsImpl } from "react-hook-form/dist/types";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Input } from "../../../forms.common/Input";
import { Select } from "../../../forms.common/Select";
import { useFetcher } from "../../../hooks.common/useFetcher";
import { useProcess } from "../../../hooks.queries/useProcess";
import { useSystemStitchingModifiers } from "../../../hooks.queries/useSystemStitchingModifiers";
import {
	useProcessMachiningFoldingQuestionsFormSchema,
	useProcessMachiningPalletStitchingQuestionsFormSchema,
	useProcessMachiningStitchingQuestionsFormSchema,
	useProcessMachiningStrobelStitchingQuestionsFormSchema,
} from "../../../hooks.schema/forms";
import { FormFooter } from "./_FormFooter";
import {
	MachiningFoldingQuestionsState,
	MachiningPalletStitchingQuestionsState,
	MachiningStitchingQuestionsState,
	MachiningStrobelStitchingQuestionsState,
	QuestionsContext,
} from "./_QuestionsContext";
import { convertBetweenInchCM } from "../../../utilities.common/MathsUtilities";
import { useProcessDefinitionsMachining } from "../../../hooks.queries/useProcessDefinitionsMachining";

export const MachiningQuestions = () => {
	const { t } = useTranslation();
	const { systemStitchingModifierOptions } = useSystemStitchingModifiers();
	const process = useProcess();
	const processDefinitionsMachining = useProcessDefinitionsMachining();

	const {
		previewMode,
		activeGroupId,
		setGroupState,
		getGroupState,
		machiningStitchingQuestionsState,
		setMachiningStitchingQuestionsState,
		machiningPalletStitchingQuestionsState,
		setMachiningPalletStitchingQuestionsState,
		machiningStrobelStitchingQuestionsState,
		setMachiningStrobelStitchingQuestionsState,
		machiningFoldingQuestionsState,
		setMachiningFoldingQuestionsState,
		setGroupSubmit,
		setIsSaving,
		formHasChanged,
	} = useContext(QuestionsContext);

	const { fetcher, isFetching } = useFetcher();

	const processMachiningStitchingQuestionsFormSchema =
		useProcessMachiningStitchingQuestionsFormSchema();
	type ProcessMachiningStitchingQuestionsFormData = z.infer<
		typeof processMachiningStitchingQuestionsFormSchema
	>;
	const processMachiningPalletStitchingQuestionsFormSchema =
		useProcessMachiningPalletStitchingQuestionsFormSchema();
	type ProcessMachiningPalletStitchingQuestionsFormData = z.infer<
		typeof processMachiningPalletStitchingQuestionsFormSchema
	>;
	const processMachiningStrobelStitchingQuestionsFormSchema =
		useProcessMachiningStrobelStitchingQuestionsFormSchema();
	type ProcessMachiningStrobelStitchingQuestionsFormData = z.infer<
		typeof processMachiningStrobelStitchingQuestionsFormSchema
	>;
	const processMachiningFoldingQuestionsFormSchema =
		useProcessMachiningFoldingQuestionsFormSchema();
	type ProcessMachiningFoldingQuestionsFormData = z.infer<
		typeof processMachiningFoldingQuestionsFormSchema
	>;

	let schemaToUse: unknown = undefined;

	switch (process.CategoryKind) {
		case "ocStitching":
			schemaToUse = processMachiningStitchingQuestionsFormSchema;
			break;
		case "ocPalletStitching":
			schemaToUse = processMachiningPalletStitchingQuestionsFormSchema;
			break;
		case "ocStrobelStitching":
			schemaToUse = processMachiningStrobelStitchingQuestionsFormSchema;
			break;
		case "ocFolding":
			schemaToUse = processMachiningFoldingQuestionsFormSchema;
			break;
	}

	const {
		setValue,
		getValues,
		control,
		handleSubmit,
		getFieldState,
		register,
		trigger,
		formState: { errors, isValid },
	} = useForm<
		| ProcessMachiningStitchingQuestionsFormData
		| ProcessMachiningPalletStitchingQuestionsFormData
		| ProcessMachiningStrobelStitchingQuestionsFormData
		| ProcessMachiningFoldingQuestionsFormData
	>({
		mode: "onChange",
		resolver: zodResolver(schemaToUse),
	});

	useEffect(() => {
		if (!isValid) {
			setGroupState(activeGroupId as number, "error");
		} else {
			const {
				next,
				group: { isDirty },
			} = getGroupState(activeGroupId as number);
			setGroupState(
				activeGroupId as number,
				!isDirty && next === "incomplete" ? "initial" : next
			);
		}
	}, [errors, isValid, activeGroupId, getGroupState, setGroupState]);

	useEffect(() => {
		if (!previewMode) {
			setIsSaving(isFetching);
		}
	}, [isFetching, previewMode, setIsSaving]);

	useEffect(() => {
		trigger(undefined, { shouldFocus: true });
	}, [activeGroupId, trigger]);

	const handleBlur = (e: FocusEvent<HTMLInputElement, Step>) => {
		const name = e.target.name as keyof (
			| MachiningStitchingQuestionsState
			| MachiningPalletStitchingQuestionsState
			| MachiningStrobelStitchingQuestionsState
			| MachiningFoldingQuestionsState
		);
		const { invalid } = getFieldState(name);

		switch (process.CategoryKind) {
			case "ocStitching":
				setMachiningStitchingQuestionsState((previous) => {
					const next = { ...previous };
					next[name] = {
						value: e.target.value,
						answered: !invalid,
					};
					return next;
				});

				formHasChanged("Machining_Stitching");

				break;
			case "ocPalletStitching":
				setMachiningPalletStitchingQuestionsState((previous) => {
					const next = { ...previous };
					next[name] = {
						value: e.target.value,
						answered: !invalid,
					};
					return next;
				});

				formHasChanged("Machining_Pallet_Stitching");

				break;
			case "ocStrobelStitching":
				setMachiningStrobelStitchingQuestionsState((previous) => {
					const next = { ...previous };
					next[name] = {
						value: e.target.value,
						answered: !invalid,
					};
					return next;
				});

				formHasChanged("Machining_Strobel_Stitching");

				break;
			case "ocFolding":
				setMachiningFoldingQuestionsState((previous) => {
					const next = { ...previous };
					next[name] = {
						value: e.target.value,
						answered: !invalid,
					};
					return next;
				});

				formHasChanged("Machining_Folding");

				break;
		}
		if (e.target.name === "densityPerInch") {
			const dp =
				process.CategoryKind === "ocPalletStitching"
					? processDefinitionsMachining.Pallet_Density_dps
					: processDefinitionsMachining.Density_dps;

			e.currentTarget.value = e.currentTarget.valueAsNumber.toFixed(dp);
		}
	};

	const handleChange = (value: string, name: string) => {
		const setQuestionStateDensity = (
			state:
				| MachiningStitchingQuestionsState
				| MachiningPalletStitchingQuestionsState
				| MachiningStrobelStitchingQuestionsState
				| MachiningFoldingQuestionsState,
			dp: number
		) => {
			let calculatedValue: number = getValues("densityPerInch");

			if (value === "inch") {
				calculatedValue = convertBetweenInchCM(calculatedValue, false);
			} else if (value === "cm") {
				calculatedValue = convertBetweenInchCM(calculatedValue, true);
			}
			setValue("densityPerInch", calculatedValue.toFixed(dp));
			state["densityPerInch"] = {
				value: calculatedValue,
				answered: true,
			};
			return state;
		};

		switch (process.CategoryKind) {
			case "ocStitching":
				setMachiningStitchingQuestionsState((previous) => {
					let next = { ...previous };
					next[name as keyof MachiningStitchingQuestionsState] = {
						value: value,
						answered: true,
					};
					if (name === "densityUnits") {
						next = setQuestionStateDensity(
							next,
							processDefinitionsMachining.Density_dps
						);
					}
					return next;
				});

				formHasChanged("Machining_Stitching");

				break;
			case "ocPalletStitching":
				setMachiningPalletStitchingQuestionsState((previous) => {
					let next = { ...previous };
					next[name as keyof MachiningPalletStitchingQuestionsState] =
						{
							value: value,
							answered: true,
						};
					if (name === "densityUnits") {
						next = setQuestionStateDensity(
							next,
							processDefinitionsMachining.Pallet_Density_dps
						);
					}

					return next;
				});

				formHasChanged("Machining_Pallet_Stitching");

				break;
			case "ocStrobelStitching":
				setMachiningStrobelStitchingQuestionsState((previous) => {
					let next = { ...previous };
					next[
						name as keyof MachiningStrobelStitchingQuestionsState
					] = {
						value: value,
						answered: true,
					};
					next = setQuestionStateDensity(
						next,
						processDefinitionsMachining.Density_dps
					);

					return next;
				});

				formHasChanged("Machining_Strobel_Stitching");

				break;
			case "ocFolding":
				setMachiningFoldingQuestionsState((previous) => {
					let next = { ...previous };
					next[name as keyof MachiningFoldingQuestionsState] = {
						value: value,
						answered: true,
					};
					if (name === "densityUnits") {
						next = setQuestionStateDensity(
							next,
							processDefinitionsMachining.Density_dps
						);
					}
					return next;
				});

				formHasChanged("Machining_Folding");

				break;
		}
	};

	const renderQuestions = () => {
		switch (process.CategoryKind) {
			case "ocStitching": {
				const stitchingErrors = errors as Partial<
					FieldErrorsImpl<ProcessMachiningStitchingQuestionsFormData>
				>;
				return (
					<>
						<div className="max-w-lg">
							<Input
								error={stitchingErrors.minimumSpeed}
								htmlFor={"minimumSpeed"}
								label={t("minimumSpeed")}
								name="minimumSpeed"
								defaultValue={Number(
									machiningStitchingQuestionsState
										?.minimumSpeed?.value
								)}
								type="number"
								register={register}
								onBlur={handleBlur}
								onChange={(e) =>
									handleChange(
										e.target.value ?? 1,
										e.target.name
									)
								}
							/>
							<Input
								error={stitchingErrors.maximumSpeed}
								htmlFor={"maximumSpeed"}
								label={t("maximumSpeed")}
								name="maximumSpeed"
								defaultValue={Number(
									machiningStitchingQuestionsState
										?.maximumSpeed?.value
								)}
								type="number"
								register={register}
								onBlur={handleBlur}
								onChange={(e) =>
									handleChange(
										e.target.value ?? 1,
										e.target.name
									)
								}
							/>
						</div>
						<div className="form-field--wide">
							<Input
								error={stitchingErrors.densityPerInch}
								htmlFor={"densityPerInch"}
								label={t("density")}
								name="densityPerInch"
								defaultValue={Number(
									machiningStitchingQuestionsState
										?.densityPerInch?.value
								).toFixed(
									processDefinitionsMachining.Density_dps
								)}
								type="number"
								register={register}
								onBlur={handleBlur}
								onChange={(e) =>
									handleChange(
										e.target.value ?? 1,
										e.target.name
									)
								}
							/>
							<Select
								control={control}
								htmlFor="densityUnits"
								name="densityUnits"
								label={t("per")}
								options={[
									{
										value: "inch",
									},
									{
										value: "cm",
									},
								]}
								defaultValue={
									machiningStitchingQuestionsState
										?.densityUnits?.value as "inch" | "cm"
								}
								placeholder="Select a value..."
								onChange={(_, v) =>
									handleChange(v, "densityUnits")
								}
								className="w-60"
							/>
						</div>
						<div className="max-w-lg">
							<Select
								error={stitchingErrors.materialProperty}
								control={control}
								htmlFor="materialProperty"
								name="materialProperty"
								label={t("materialProperty")}
								options={[
									{
										value: "floppy",
									},
									{
										value: "normal",
									},
								]}
								defaultValue={
									machiningStitchingQuestionsState
										?.materialProperty?.value as
										| "floppy"
										| "normal"
								}
								placeholder="Select a value..."
								onChange={(_, v) =>
									handleChange(v, "materialProperty")
								}
							/>
							<Select
								error={stitchingErrors.machineType}
								control={control}
								htmlFor="machineType"
								name="machineType"
								label={t("machineType")}
								options={[
									{
										value: "post",
									},
									{
										value: "flat",
									},
								]}
								defaultValue={
									machiningStitchingQuestionsState
										?.machineType?.value as "post" | "flat"
								}
								placeholder="Select a value..."
								onChange={(_, v) =>
									handleChange(v, "machineType")
								}
							/>
							<Select
								error={stitchingErrors.needleType}
								control={control}
								htmlFor="needleType"
								name="needleType"
								label={t("needleType")}
								options={[
									{
										value: "twin",
									},
									{
										value: "single",
									},
								]}
								defaultValue={
									machiningStitchingQuestionsState?.needleType
										?.value as "twin" | "single"
								}
								placeholder="Select a value..."
								onChange={(_, v) =>
									handleChange(v, "needleType")
								}
							/>
							<Select
								error={stitchingErrors.stitchingModifier}
								control={control}
								htmlFor="stitchingModifier"
								name="stitchingModifier"
								label={t("process")}
								options={systemStitchingModifierOptions}
								defaultValue={
									machiningStitchingQuestionsState
										.stitchingModifier?.value
										? Number(
												machiningStitchingQuestionsState
													.stitchingModifier?.value
										  )
										: 1
								}
								placeholder="Select a value..."
								onChange={(_, v) =>
									handleChange(v, "stitchingModifier")
								}
							/>
						</div>
					</>
				);
			}
			case "ocPalletStitching": {
				const palletStitchingErrors = errors as Partial<
					FieldErrorsImpl<ProcessMachiningPalletStitchingQuestionsFormData>
				>;
				return (
					<>
						<Input
							error={palletStitchingErrors.programmedSpeed}
							htmlFor={"programmedSpeed"}
							label={t("programmedSpeed")}
							name="programmedSpeed"
							defaultValue={Number(
								machiningPalletStitchingQuestionsState
									?.programmedSpeed?.value
							)}
							type="number"
							register={register}
							onBlur={handleBlur}
						/>
						<Select
							control={control}
							htmlFor="densityUnits"
							name="densityUnits"
							label={t("densityUnits")}
							options={[
								{
									value: "inch",
								},
								{
									value: "cm",
								},
							]}
							defaultValue={
								machiningPalletStitchingQuestionsState
									?.densityUnits?.value as "inch" | "cm"
							}
							placeholder="Select a value..."
							onChange={(_, v) => handleChange(v, "densityUnits")}
						/>
						<Input
							error={palletStitchingErrors.densityPerInch}
							htmlFor={"densityPerInch"}
							label={
								machiningPalletStitchingQuestionsState
									.densityUnits?.value === "cm"
									? t("densityPerCM")
									: t("densityPerInch")
							}
							name="densityPerInch"
							defaultValue={Number(
								machiningPalletStitchingQuestionsState
									?.densityPerInch?.value
							).toFixed(
								processDefinitionsMachining.Pallet_Density_dps
							)}
							type="number"
							register={register}
							onBlur={handleBlur}
						/>
					</>
				);
			}
			case "ocStrobelStitching": {
				const strobelStitchingErrors = errors as Partial<
					FieldErrorsImpl<ProcessMachiningStrobelStitchingQuestionsFormData>
				>;
				return (
					<>
						<Input
							error={strobelStitchingErrors.minimumSpeed}
							htmlFor={"minimumSpeed"}
							label={t("minimumSpeed")}
							name="minimumSpeed"
							defaultValue={Number(
								machiningStrobelStitchingQuestionsState
									?.minimumSpeed?.value
							)}
							type="number"
							register={register}
							onBlur={handleBlur}
						/>
						<Input
							error={strobelStitchingErrors.maximumSpeed}
							htmlFor={"maximumSpeed"}
							label={t("maximumSpeed")}
							name="maximumSpeed"
							defaultValue={Number(
								machiningStrobelStitchingQuestionsState
									.maximumSpeed?.value
							)}
							type="number"
							register={register}
							onBlur={handleBlur}
						/>
						<Select
							control={control}
							htmlFor="densityUnits"
							name="densityUnits"
							label={t("densityUnits")}
							options={[
								{
									value: "inch",
								},
								{
									value: "cm",
								},
							]}
							defaultValue={
								machiningStrobelStitchingQuestionsState
									?.densityUnits?.value as "inch" | "cm"
							}
							placeholder="Select a value..."
							onChange={(_, v) => handleChange(v, "densityUnits")}
						/>
						<Input
							error={strobelStitchingErrors.densityPerInch}
							htmlFor={"densityPerInch"}
							label={
								machiningStrobelStitchingQuestionsState
									.densityUnits?.value === "cm"
									? t("densityPerCM")
									: t("densityPerInch")
							}
							name="densityPerInch"
							defaultValue={Number(
								machiningStrobelStitchingQuestionsState
									?.densityPerInch?.value
							).toFixed(
								processDefinitionsMachining.Density_dps
							)}
							type="number"
							register={register}
							onBlur={handleBlur}
						/>
					</>
				);
			}
			case "ocFolding": {
				const foldingErrors = errors as Partial<
					FieldErrorsImpl<ProcessMachiningFoldingQuestionsFormData>
				>;
				return (
					<>
						<Input
							error={foldingErrors.minimumSpeed}
							htmlFor={"minimumSpeed"}
							label={t("minimumSpeed")}
							name="minimumSpeed"
							defaultValue={Number(
								machiningFoldingQuestionsState?.minimumSpeed
									?.value
							)}
							type="number"
							register={register}
							onBlur={handleBlur}
						/>
						<Input
							error={foldingErrors.maximumSpeed}
							htmlFor={"maximumSpeed"}
							label={t("maximumSpeed")}
							name="maximumSpeed"
							defaultValue={Number(
								machiningFoldingQuestionsState.maximumSpeed
									?.value
							)}
							type="number"
							register={register}
							onBlur={handleBlur}
						/>
						<Select
							control={control}
							htmlFor="densityUnits"
							name="densityUnits"
							label={t("densityUnits")}
							options={[
								{
									value: "inch",
								},
								{
									value: "cm",
								},
							]}
							defaultValue={
								machiningFoldingQuestionsState?.densityUnits
									?.value as "inch" | "cm"
							}
							placeholder="Select a value..."
							onChange={(_, v) => handleChange(v, "densityUnits")}
						/>
						<Input
							error={foldingErrors.densityPerInch}
							htmlFor={"densityPerInch"}
							label={
								machiningFoldingQuestionsState.densityUnits
									?.value === "cm"
									? t("densityPerCM")
									: t("densityPerInch")
							}
							name="densityPerInch"
							defaultValue={Number(
								machiningFoldingQuestionsState?.densityPerInch
									?.value
							).toFixed(
								processDefinitionsMachining.Density_dps
							)}
							type="number"
							register={register}
							onBlur={handleBlur}
						/>
						<Select
							error={foldingErrors.materialProperty}
							control={control}
							htmlFor="materialProperty"
							name="materialProperty"
							label={t("materialProperty")}
							options={[
								{
									value: "floppy",
								},
								{
									value: "normal",
								},
							]}
							defaultValue={
								machiningFoldingQuestionsState?.materialProperty
									?.value as "floppy" | "normal"
							}
							placeholder="Select a value..."
							onChange={(_, v) =>
								handleChange(v, "materialPropertyFloppy")
							}
						/>
					</>
				);
			}
			default:
				return <></>;
		}
	};

	const onSubmit = (data: ProcessMachiningStitchingQuestionsFormData | ProcessMachiningPalletStitchingQuestionsFormData | ProcessMachiningStrobelStitchingQuestionsFormData | ProcessMachiningFoldingQuestionsFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	return (
		<>
			<fetcher.Form
				id="questionsForm"
				onSubmit={(e) => {
					if (!isValid) {
						handleSubmit(onSubmit, onSubmitError)(e);

						return;
					}

					switch (process.CategoryKind) {
						case "ocStitching":
							setMachiningStitchingQuestionsState((previous) => {
								const next = { ...previous };
								Object.keys(next).forEach(
									(q) =>
										(next[
											q as keyof MachiningStitchingQuestionsState
										]!.answered = true)
								);

								return next;
							});

							formHasChanged("Machining_Stitching");

							break;
						case "ocPalletStitching":
							setMachiningPalletStitchingQuestionsState(
								(previous) => {
									const next = { ...previous };
									Object.keys(next).forEach(
										(q) =>
											(next[
												q as keyof MachiningPalletStitchingQuestionsState
											]!.answered = true)
									);

									return next;
								}
							);

							formHasChanged("Machining_Pallet_Stitching");

							break;
						case "ocStrobelStitching":
							setMachiningStrobelStitchingQuestionsState(
								(previous) => {
									const next = { ...previous };
									Object.keys(next).forEach(
										(q) =>
											(next[
												q as keyof MachiningStrobelStitchingQuestionsState
											]!.answered = true)
									);

									return next;
								}
							);

							formHasChanged("Machining_Strobel_Stitching");

							break;
						case "ocFolding":
							setMachiningFoldingQuestionsState((previous) => {
								const next = { ...previous };
								Object.keys(next).forEach(
									(q) =>
										(next[
											q as keyof MachiningFoldingQuestionsState
										]!.answered = true)
								);

								return next;
							});
							formHasChanged("Machining_Folding");

							break;
					}

					setGroupSubmit(true);
				}}
			>
				<div className="form-field__group--inline [&_label]:w-1/2">
					{renderQuestions()}
				</div>
				<FormFooter />
			</fetcher.Form>
		</>
	);
};
