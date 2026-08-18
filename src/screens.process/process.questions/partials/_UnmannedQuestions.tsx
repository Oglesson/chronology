import { zodResolver } from "@hookform/resolvers/zod";
import { FocusEvent, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Input } from "../../../forms.common/Input";
import { Select } from "../../../forms.common/Select";
import { useFetcher } from "../../../hooks.common/useFetcher";
import { useProcessUnmannedQuestionsFormSchema } from "../../../hooks.schema/forms";
import { FormFooter } from "./_FormFooter";
import { QuestionsContext, UnmannedQuestionsState } from "./_QuestionsContext";

export const UnmannedQuestions = () => {
	const processUnmannedQuestionsFormSchema =
		useProcessUnmannedQuestionsFormSchema();
	type ProcessUnmannedQuestionsFormData = z.infer<
		typeof processUnmannedQuestionsFormSchema
	>;
	const {
		previewMode,
		activeGroupId,
		setGroupState,
		getGroupState,
		unmannedQuestionsState,
		setUnmannedQuestionsState,
		setGroupSubmit,
		setIsSaving,
		formHasChanged,
	} = useContext(QuestionsContext);

	const { fetcher, isFetching } = useFetcher();

	const { t } = useTranslation();

	const {
		control,
		getFieldState,
		handleSubmit,
		register,
		trigger,
		formState: { errors, isValid },
	} = useForm({
		mode: "onChange",
		resolver: zodResolver(processUnmannedQuestionsFormSchema),
	});

	const onSubmit = (data: ProcessUnmannedQuestionsFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	const handleBlur = (e: FocusEvent<HTMLInputElement, Step>) => {
		setUnmannedQuestionsState((previous) => {
			const next = { ...previous };
			const name = e.target.name as keyof UnmannedQuestionsState;
			const { invalid } = getFieldState(name);

			next[name] = {
				value: e.target.value,
				answered: !invalid,
			};

			return next;
		});
		formHasChanged("Unmanned");
		if (e.target.name === "wholeCycleTime") {
			e.currentTarget.value = e.currentTarget.valueAsNumber.toFixed(3);
		}
	};

	const handleChange = (value: string, name: string) => {
		setUnmannedQuestionsState((previous) => {
			const next = { ...previous };
			next[name as keyof UnmannedQuestionsState] = {
				value: value,
				answered: true,
			};

			return next;
		});

		formHasChanged("Unmanned");
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

				setUnmannedQuestionsState((previous) => {
					const next = { ...previous };
					Object.keys(next).forEach(
						(q) =>
							(next[q as keyof UnmannedQuestionsState]!.answered =
								true)
					);

					return next;
				});

				formHasChanged("Unmanned");

				setGroupSubmit(true);
			}}
		>
			<div className="form-field__group--inline max-w-lg [&_.form-field>label]:w-1/2">
				<Input
					error={errors.wholeCycleTime}
					htmlFor={"wholeCycleTime"}
					label={t("wholeCycleTime")}
					name="wholeCycleTime"
					defaultValue={unmannedQuestionsState.wholeCycleTime?.value?.toString()}
					type="number"
					register={register}
					onBlur={handleBlur}
				/>
				<Input
					error={errors.maximumUnits}
					htmlFor={"maximumUnits"}
					label={t("capacity")}
					name="maximumUnits"
					defaultValue={unmannedQuestionsState.maximumUnits?.value?.toString()}
					type="number"
					register={register}
					onBlur={handleBlur}
				/>
				<Input
					error={errors.lanes}
					htmlFor={"lanes"}
					label={t("lanes")}
					name="lanes"
					defaultValue={unmannedQuestionsState.lanes?.value?.toString()}
					type="number"
					register={register}
					onBlur={handleBlur}
				/>
				<Select
					error={errors.valueAdded}
					control={control}
					htmlFor="valueAdded"
					name="valueAdded"
					label={t("valueAdded")}
					options={[
						{
							value: "yes",
						},
						{
							value: "no",
						},
					]}
					defaultValue={
						unmannedQuestionsState.valueAdded?.value as "yes" | "no"
					}
					placeholder="Select a value..."
					onChange={(_, v) => handleChange(v, "valueAdded")}
				/>
				<Select
					error={errors.emptyBeforeShutdown}
					control={control}
					htmlFor="emptyBeforeShutdown"
					name="emptyBeforeShutdown"
					label={t("emptyBeforeShutdown")}
					options={[
						{
							value: "yes",
						},
						{
							value: "no",
						},
					]}
					defaultValue={
						unmannedQuestionsState.emptyBeforeShutdown?.value as
							| "yes"
							| "no"
					}
					placeholder="Select a value..."
					onChange={(_, v) => handleChange(v, "emptyBeforeShutdown")}
				/>
				<Select
					error={errors.emptyItself}
					control={control}
					htmlFor="emptyItself"
					name="emptyItself"
					label={t("emptyItself")}
					options={[
						{
							value: "yes",
						},
						{
							value: "no",
						},
					]}
					defaultValue={
						unmannedQuestionsState.emptyItself?.value as
							| "yes"
							| "no"
					}
					placeholder="Select a value..."
					onChange={(_, v) => handleChange(v, "emptyItself")}
				/>
			</div>
			<FormFooter />
		</fetcher.Form>
	);
};
