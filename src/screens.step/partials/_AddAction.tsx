import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AutoComplete } from "../../forms.common/AutoComplete";
import { Input } from "../../forms.common/Input";
import { ActionData } from "../../api.common/types";
import { StepHandActionData } from "../../hooks.queries/useStep";
import { ActionColSectionData } from "./_Modal";
import { useStepActionFormSchema } from "../../hooks.schema/forms";
import { z } from "zod";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/common/button/Button";
import { useActions } from "../../hooks.queries/useActions";

type AddActionProps = {
	handleModalClose: () => void;
	data?: StepHandActionData;
	settingItemsToAdd: (sectionData: ActionColSectionData) => void;
	content?: { titleActionID: string; button: string };
	isOpen?: boolean;
};

export const AddAction = ({
	handleModalClose,
	data,
	settingItemsToAdd,
	content,
	isOpen,
}: AddActionProps) => {
	const { t } = useTranslation();
	const { actions } = useActions();
	const stepActionFormSchema = useStepActionFormSchema();
	type StepActionFormData = z.infer<typeof stepActionFormSchema>;

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(stepActionFormSchema),
	});
	const onSubmit = (data: StepActionFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	useEffect(() => {
		if (isOpen) {
			reset();
		}
	}, [isOpen, reset]);

	return (
		<>
			<h2 className="typo-h3 mb-12">
				{content?.titleActionID ?? "Add/Edit Action"}
			</h2>
			<form
				onSubmit={(e) => {
					if (!isValid) {
						handleSubmit(onSubmit, onSubmitError)(e);

						return;
					}

					e.preventDefault();

					const formData = new FormData(e.target as HTMLFormElement);

					const { comment, frequency, action } = Object.fromEntries(
						formData.entries(),
					);
					const actionData: ActionData = JSON.parse(action as string);

					const sectionData = {
						Comment: comment as string,
						Quantity: Number(frequency),
						ActionID: actionData.ID,
						Action: actionData,
					};

					settingItemsToAdd(sectionData);
					reset();
				}}
			>
				{actions && (
					<AutoComplete
						key={data ? `action-${data?.ActionID}` : null}
						defaultValue={data?.Action}
						control={control}
						error={errors.action as FieldError | undefined}
						htmlFor={"action"}
						label="Action"
						name="action"
						options={actions}
						optionLabelKeys={["Code", "Description"]}
					/>
				)}
				<Input
					defaultValue={data?.Comment ?? undefined}
					error={errors.comment}
					htmlFor={"comment"}
					label={t("comment")}
					name="comment"
					register={register}
				/>
				<Input
					defaultValue={data?.Quantity ?? undefined}
					error={errors.frequency}
					htmlFor={"frequency"}
					label={t("frequency")}
					name="frequency"
					register={register}
					type="number"
				/>

				<div className="flex justify-end items-end mt-12 gap-6">
					<Button
						style="secondary"
						text={t("cancel")}
						onClick={handleModalClose}
					/>
					<Button
						text={content?.button ?? "Add/Edit"}
						type="submit"
					/>
				</div>
			</form>
		</>
	);
};
