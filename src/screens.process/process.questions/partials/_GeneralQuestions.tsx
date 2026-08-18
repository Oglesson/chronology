import { zodResolver } from "@hookform/resolvers/zod";
import { FocusEvent, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Input } from "../../../forms.common/Input";
import { Select } from "../../../forms.common/Select";
import { useFetcher } from "../../../hooks.common/useFetcher";
import { useGrades } from "../../../hooks.queries/useGrades";
import { useMachines } from "../../../hooks.queries/useMachines";
import { useProcess } from "../../../hooks.queries/useProcess";
import { useProcessGeneralQuestionsFormSchema } from "../../../hooks.schema/forms";
import { FormFooter } from "./_FormFooter";
import { GeneralQuestionsState, QuestionsContext } from "./_QuestionsContext";

export const GeneralQuestions = () => {
	const { machineOptions } = useMachines();
	const { gradeOptions } = useGrades();
	const process = useProcess();

	const processGeneralQuestionsFormSchema =
		useProcessGeneralQuestionsFormSchema(!process?.Frozen);
	type ProcessGeneralQuestionsFormData = z.infer<
		typeof processGeneralQuestionsFormSchema
	>;
	const {
		previewMode,
		activeGroupId,
		setGroupState,
		getGroupState,
		generalQuestionsState,
		setGeneralQuestionsState,
		setGroupSubmit,
		setIsSaving,
		formHasChanged,
	} = useContext(QuestionsContext);

	const { fetcher, isFetching } = useFetcher();

	const { t } = useTranslation();

	const {
		control,
		handleSubmit,
		getFieldState,
		register,
		trigger,
		formState: { errors, isValid },
	} = useForm({
		mode: "onChange",
		resolver: zodResolver(processGeneralQuestionsFormSchema),
	});

	const onSubmit = (data: ProcessGeneralQuestionsFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	const handleBlur = (e: FocusEvent<HTMLInputElement, Step>) => {
		setGeneralQuestionsState((previous) => {
			const next = { ...previous };
			const name = e.target.name as keyof GeneralQuestionsState;
			const { invalid } = getFieldState(name);

			next[name] = {
				value: e.target.value,
				answered: !invalid,
			};
			return { ...next };
		});
		formHasChanged("Header");
	};

	const handleChange = (value: string, name: string) => {
		setGeneralQuestionsState((previous) => {
			const next = { ...previous };
			next[name as keyof GeneralQuestionsState] = {
				value: value,
				answered: true,
			};

			return { ...next };
		});
		formHasChanged("Header");
	};

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

	return (
		<fetcher.Form
			onSubmit={(e) => {
				if (!isValid) {
					handleSubmit(onSubmit, onSubmitError)(e);

					return;
				}

				setGeneralQuestionsState((previous) => {
					const next: GeneralQuestionsState = { ...previous };
					Object.keys(next).forEach(
						(q) =>
							(next[q as keyof GeneralQuestionsState]!.answered =
								true)
					);

					return { ...next };
				});
				formHasChanged("Header");
				setGroupSubmit(true);
			}}
		>
			<div className="form-field__group--inline max-w-lg">
				<div
					className={
						process.CategoryKind !== "ocUnmanned"
							? undefined
							: "hidden"
					}
				>
					<Input
						error={errors.batchSize}
						htmlFor={"batchSize"}
						label={t("batchSize")}
						name="batchSize"
						defaultValue={generalQuestionsState.batchSize?.value?.toString()}
						type="number"
						register={register}
						onBlur={handleBlur}
						onChange={(e) =>
							handleChange(e.target.value ?? 1, e.target.name)
						}
					/>
				</div>
				<Select
					error={errors.grade}
					control={control}
					htmlFor="grade"
					name="grade"
					label={t("grade")}
					options={gradeOptions ?? []}
					defaultValue={
						generalQuestionsState.grade?.value
							? Number(generalQuestionsState.grade?.value)
							: 1
					}
					placeholder="Select a value..."
					onChange={(_, v) => handleChange(v ?? 1, "grade")}
					tooltipContent={t("tooltipOperationQuestionGrade")}
				/>
				<div
					className={
						process.CategoryKind === "ocUnmanned" ||
						(process.CategoryKind === "ocGroup" &&
							generalQuestionsState.groupAllowance?.value ===
								"no")
							? "hidden"
							: undefined
					}
				>
					<Input
						error={errors.rest}
						htmlFor={"rest"}
						label={t("rest")}
						name="rest"
						defaultValue={generalQuestionsState.rest?.value?.toString()}
						type="number"
						register={register}
						onBlur={handleBlur}
						tooltipContent={t("tooltipOperationQuestionRest")}
						onChange={(e) =>
							handleChange(e.target.value ?? 1, e.target.name)
						}
					/>
					<Input
						error={errors.contingency}
						htmlFor={"contingency"}
						label={t("contingency")}
						name="contingency"
						defaultValue={generalQuestionsState.contingency?.value?.toString()}
						type="number"
						register={register}
						onBlur={handleBlur}
						tooltipContent={t(
							"tooltipOperationQuestionContingency"
						)}
						onChange={(e) =>
							handleChange(e.target.value ?? 1, e.target.name)
						}
					/>
				</div>

				<Select
					error={errors.madeInPairs}
					control={control}
					htmlFor="madeInPairs"
					name="madeInPairs"
					label={t("madeInPairs")}
					options={[
						{
							value: "yes",
						},
						{
							value: "no",
						},
					]}
					defaultValue={
						generalQuestionsState.madeInPairs?.value as "yes" | "no"
					}
					placeholder="Select a value..."
					onChange={(_, v) => handleChange(v, "madeInPairs")}
				/>
				<Input
					error={
						process.Frozen ? undefined : errors?.itemsTaskCovers
					}
					htmlFor={"itemsTaskCovers"}
					label={t("itemsTaskCovers")}
					name="itemsTaskCovers"
					defaultValue={generalQuestionsState.itemsTaskCovers?.value?.toString()}
					type="number"
					register={register}
					onBlur={handleBlur}
					disabled={process.Frozen}
					tooltipContent={
						process.Frozen
							? undefined
							: t("tooltipOperationItemsCovers")
					}
					onChange={(e) =>
						handleChange(e.target.value ?? 1, e.target.name)
					}
				/>
				<div
					className={
						process.CategoryKind !== "ocGroup"
							? undefined
							: "hidden"
					}
				>
					<Select
						error={errors.machine}
						control={control}
						htmlFor="machine"
						name="machine"
						label={t("machine")}
						options={[
							{
								label: t("none"),
								value: "null",
							},
							...machineOptions,
						]}
						defaultValue={
							generalQuestionsState.machine?.value &&
							generalQuestionsState.machine?.value !== "null"
								? Number(generalQuestionsState.machine?.value)
								: "null"
						}
						placeholder="Select a value..."
						onChange={(_, v) => handleChange(v, "machine")}
					/>
				</div>
				<div
					className={
						process.CategoryKind === "ocGroup"
							? undefined
							: "hidden"
					}
				>
					<Select
						error={errors.groupAllowance}
						control={control}
						htmlFor="groupAllowance"
						name="groupAllowance"
						label={t("groupAllowance")}
						options={[
							{
								value: "yes",
							},
							{
								value: "no",
							},
						]}
						defaultValue={
							generalQuestionsState.groupAllowance?.value as
								| "yes"
								| "no"
						}
						placeholder="Select a value..."
						onChange={(_, v) => handleChange(v, "groupAllowance")}
					/>
				</div>
			</div>
			<FormFooter />
		</fetcher.Form>
	);
};
