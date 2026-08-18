import { zodResolver } from "@hookform/resolvers/zod";
import { FocusEvent, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FieldErrorsImpl } from "react-hook-form/dist/types";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Input } from "../../../forms.common/Input";
import { useFetcher } from "../../../hooks.common/useFetcher";
import { useDensityPerInchFieldSchema } from "../../../hooks.schema/fields";
import { FormFooter } from "../../../screens.process/process.questions/partials/_FormFooter";

import {
	PreviewMachiningQuestionsState,
	PreviewQuestionsContext,
} from "./_PreviewQuestionsContext";

export const PreviewMachiningQuestions = () => {
	const { t } = useTranslation();

	const {
		activeGroupId,
		setGroupState,
		getGroupState,
		machiningQuestionsState,
		setMachiningQuestionsState,
		setGroupSubmit,
	} = useContext(PreviewQuestionsContext);

	const { fetcher } = useFetcher();

	const machiningPreviewFormSchema = useDensityPerInchFieldSchema();
	type MachiningPreviewFormSchemaData = z.infer<
		typeof machiningPreviewFormSchema
	>;

	const {
		handleSubmit,
		getFieldState,
		register,
		trigger,
		formState: { errors, isValid },
	} = useForm({
		mode: "onChange",
		resolver: zodResolver(machiningPreviewFormSchema),
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
		trigger(undefined, { shouldFocus: true });
	}, [activeGroupId, trigger]);

	const handleBlur = (e: FocusEvent<HTMLInputElement, Step>) => {
		const name = e.target.name as keyof PreviewMachiningQuestionsState;
		const { invalid } = getFieldState(name);

		setMachiningQuestionsState((previous) => {
			const next = { ...previous };
			next[name] = {
				value: e.target.value,
				answered: !invalid,
			};

			return next;
		});
	};

	const renderQuestions = () => {
		const machiningErrors = errors as Partial<
			FieldErrorsImpl<MachiningPreviewFormSchemaData>
		>;
		return (
			<Input
				error={machiningErrors.densityPerInch}
				htmlFor={"densityPerInch"}
				label={t("densityPerInch")}
				name="densityPerInch"
				defaultValue={Number(
					machiningQuestionsState.densityPerInch?.value
				)}
				type="number"
				register={register}
				onBlur={handleBlur}
			/>
		);
	};

	const onSubmit = (data: MachiningPreviewFormSchemaData) => console.log(data);
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

					setMachiningQuestionsState((previous) => {
						const next = { ...previous };

						Object.keys(next).forEach(
							(q) =>
								(next[
									q as keyof PreviewMachiningQuestionsState
								]!.answered = true)
						);

						return next;
					});

					setGroupSubmit(true);
				}}
			>
				<div className="form-field__group--inline max-w-lg [&_label]:w-1/2">
					{renderQuestions()}
				</div>
				<FormFooter />
			</fetcher.Form>
		</>
	);
};
