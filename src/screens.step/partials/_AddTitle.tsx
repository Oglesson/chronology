import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "../../components/common/button/Button";
import { useAction } from "../../hooks.queries/useAction";
import { useStepActionTitleFormSchema } from "../../hooks.schema/forms";
import { Input } from "../../forms.common/Input";
import { StepHandActionData } from "../../hooks.queries/useStep";
import { ActionColSectionData } from "./_Modal";

type AddTitleProps = {
	handleModalClose: () => void;
	data?: StepHandActionData;
	settingItemsToAdd: (sectionData: ActionColSectionData) => void;
	content?: { titleActionID: string; button: string };
	isOpen?: boolean;
};

export const AddTitle = ({
	handleModalClose,
	data,
	settingItemsToAdd,
	content,
	isOpen,
}: AddTitleProps) => {
	const { t } = useTranslation();
	const stepActionFormSchema = useStepActionTitleFormSchema();
	type StepActionFormData = z.infer<typeof stepActionFormSchema>;

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	} = useForm({
		resolver: zodResolver(stepActionFormSchema),
	});
	const onSubmit = (data: StepActionFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);
	const titleActionID = useAction(false, "__TITLE__");

	useEffect(() => {
		if (isOpen) {
			reset();
		}
	}, [isOpen, reset]);

	return (
		<>
			<h2 className="typo-h3 mb-12">
				{content?.titleActionID ?? "Add/Edit Title"}
			</h2>
			<form
				onSubmit={(e) => {
					if (!isValid) {
						handleSubmit(onSubmit, onSubmitError)(e);

						return;
					}

					e.preventDefault();

					const formData = new FormData(e.target as HTMLFormElement);
					const { title } = Object.fromEntries(formData.entries());
					const sectionData = {
						Comment: title as string,
						Quantity: 0,
						ActionID: titleActionID.ID,
						Action: null,
					};
					if (data) {
						settingItemsToAdd(sectionData);
					} else {
						settingItemsToAdd(sectionData);
					}
					reset();
				}}
			>
				<Input
					error={errors.title}
					htmlFor={"title"}
					label={t("title")}
					name="title"
					register={register}
					defaultValue={data?.Comment as string}
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
