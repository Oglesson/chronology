import { zodResolver } from "@hookform/resolvers/zod";
import { FocusEvent, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Input } from "../../../forms.common/Input";
import { useFetcher } from "../../../hooks.common/useFetcher";
import {
	useBatchSizeFieldSchema,
	useItemsTaskCoversFieldSchema,
} from "../../../hooks.schema/fields";
import { FormFooter } from "../../../screens.process/process.questions/partials/_FormFooter";

import {
	PreviewGeneralQuestionsState,
	PreviewQuestionsContext,
} from "./_PreviewQuestionsContext";

export const PreviewGeneralQuestions = () => {
	const generalQuestionsFormSchema = useItemsTaskCoversFieldSchema().merge(
		useBatchSizeFieldSchema(2000)
	);
	type GeneralQuestionsFormSchemaData = z.infer<
		typeof generalQuestionsFormSchema
	>;

	const {
		activeGroupId,
		setGroupState,
		getGroupState,
		generalQuestionsState,
		setGeneralQuestionsState,
		setGroupSubmit,
	} = useContext(PreviewQuestionsContext);

	const { fetcher } = useFetcher();

	const { t } = useTranslation();

	const {
		handleSubmit,
		getFieldState,
		register,
		trigger,
		formState: { errors, isValid },
	} = useForm({
		mode: "onChange",
		resolver: zodResolver(generalQuestionsFormSchema),
	});

	const onSubmit = (data: GeneralQuestionsFormSchemaData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	const handleBlur = (e: FocusEvent<HTMLInputElement, Step>) => {
		setGeneralQuestionsState((previous) => {
			const next = { ...previous };
			const name = e.target.name as keyof PreviewGeneralQuestionsState;
			const { invalid } = getFieldState(name);

			next[name] = {
				value: e.target.value,
				answered: !invalid,
			};

			return { ...next };
		});
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
					const next = { ...previous };
					Object.keys(next).forEach(
						(q) =>
							(next[
								q as keyof PreviewGeneralQuestionsState
							]!.answered = true)
					);

					return { ...next };
				});

				setGroupSubmit(true);
			}}
		>
			<div className="form-field__group--inline max-w-lg">
				<Input
					error={errors.batchSize}
					htmlFor={"batchSize"}
					label={t("batchSize")}
					name="batchSize"
					defaultValue={generalQuestionsState.batchSize?.value?.toString()}
					type="number"
					register={register}
					onBlur={handleBlur}
				/>
				<Input
					error={errors.itemsTaskCovers}
					htmlFor={"itemsTaskCovers"}
					label={t("itemsTaskCovers")}
					name="itemsTaskCovers"
					defaultValue={generalQuestionsState.itemsTaskCovers?.value?.toString()}
					type="number"
					register={register}
					onBlur={handleBlur}
				/>
			</div>
			<FormFooter />
		</fetcher.Form>
	);
};
