import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, FocusEvent } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { StepData } from "../../../api.common/types";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import { AutoComplete } from "../../../forms.common/AutoComplete";
import { Input } from "../../../forms.common/Input";
import { Select } from "../../../forms.common/Select";
import { useToggle } from "../../../hooks.common/useToggle";
import { useSteps } from "../../../hooks.queries/useSteps";
import { useProcessAdditionalStepsFormSchema } from "../../../hooks.schema/forms";
import { QuestionsContext } from "./_QuestionsContext";

type EditAdditionalStepProps = {
	index: number;
};

export const EditAdditionalStep = ({
	index,
}: EditAdditionalStepProps) => {
	const {
		additionalStepsQuestionsState,
		setAdditionalStepsQuestionsState,
		formHasChanged,
	} = useContext(QuestionsContext);
	const step = additionalStepsQuestionsState.value[index];
	const { steps } = useSteps(true);
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();
	const processAdditionalStepsFormSchema =
		useProcessAdditionalStepsFormSchema();
	type ProcessAdditionalStepsFormData = z.infer<
		typeof processAdditionalStepsFormSchema
	>;
	const {
		control,
		register,
		handleSubmit,
		getValues,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(processAdditionalStepsFormSchema),
	});
	const onSubmit = (data: ProcessAdditionalStepsFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	const handleInputBlur = (e: FocusEvent<HTMLInputElement, Step>) => {
		if (e.target.name === "quantity") {
			e.currentTarget.value = e.currentTarget.valueAsNumber.toFixed(4);
		}
	};

	return (
		<>
			<button type="button" onClick={setOpenModal}>
				{t("editStep", {
					defaultValue: "Edit Step",
				})}
			</button>
			<Modal isOpen={openModal}>
				<h2 className="typo-h3 mb-12">
					{t("editStep", { defaultValue: "Edit Step" })}
				</h2>
				<form
					onSubmit={(e) => {
						if (!isValid) {
							handleSubmit(onSubmit, onSubmitError)(e);

							return;
						}

						e.preventDefault();

						const { step, every, perBatch, quantity } =
							getValues();

						const stepData: StepData = JSON.parse(step);

						setAdditionalStepsQuestionsState((previous) => {
							const next = { ...previous };

							next.value[index] = {
								...next.value[index],
								StepID: Number(stepData.ID),
								Every: Number(every),
								PerBatch: perBatch === "yes",
								Quantity: Number(quantity),
								_Step: stepData,
							};

							return next;
						});
						formHasChanged("AdditionalSteps");

						setOpenModal();
					}}
				>
					<AutoComplete
						defaultValue={step?._Step}
						control={control}
						error={errors.step}
						htmlFor={"step"}
						label={t("code")}
						name="step"
						options={steps}
						optionLabelKeys="Code"
					/>
					<Input
						defaultValue={step?.Quantity?.toFixed(4)}
						error={errors.quantity}
						htmlFor={"quantity"}
						label={t("frequency")}
						name="quantity"
						register={register}
						type="number"
						onBlur={handleInputBlur}
					/>
					<div className="flex items-start w-full">
						<div className="w-1/3">
							<Input
								error={errors.every}
								htmlFor={"every"}
								name="every"
								register={register}
								type="number"
								label={t("per")}
								horizontal
								defaultValue={step?.Every}
							/>
						</div>

						<div className="w-2/3">
							<Select
								name="perBatch"
								htmlFor="perBatch"
								options={[
									{
										label: t("items", {
											defaultValue: "Item(s)",
										}),
										value: "no",
									},
									{
										label: t("batches", {
											defaultValue: "Batch(es)",
										}),
										value: "yes",
									},
								]}
								control={control}
								error={errors.perBatch}
								horizontal
								defaultValue={step?.PerBatch ? "yes" : "no"}
							/>
						</div>
					</div>
					<div className="flex justify-end items-end mt-12 gap-6">
						<Button
							style="secondary"
							text={t("cancel")}
							onClick={setOpenModal}
						/>
						<Button text={t("edit")} type="submit" />
					</div>
				</form>
			</Modal>
		</>
	);
};
