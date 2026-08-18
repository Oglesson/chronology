import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, FocusEvent } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { StepData } from "../../../api.common/types";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import Icons from "../../../config.common/Icons";
import { AutoComplete } from "../../../forms.common/AutoComplete";
import { Input } from "../../../forms.common/Input";
import { Select } from "../../../forms.common/Select";
import { useToggle } from "../../../hooks.common/useToggle";
import { useSteps } from "../../../hooks.queries/useSteps";
import { useProcessAdditionalStepsFormSchema } from "../../../hooks.schema/forms";
import { QuestionsContext } from "./_QuestionsContext";

export const AddAdditionalStep = () => {
	const processAdditionalStepsFormSchema =
		useProcessAdditionalStepsFormSchema();
	type ProcessAdditionalStepsFormData = z.infer<
		typeof processAdditionalStepsFormSchema
	>;
	const { steps } = useSteps(true);
	const [openModal, setOpenModal] = useToggle(false);

	const { setAdditionalStepsQuestionsState, formHasChanged } =
		useContext(QuestionsContext);
	const { t } = useTranslation();
	const {
		control,
		getValues,
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(processAdditionalStepsFormSchema),
	});
	const onSubmit = (data: ProcessAdditionalStepsFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	useEffect(() => {
		if (openModal) {
			reset();
		}
	}, [openModal, reset]);

	const handleInputBlur = (e: FocusEvent<HTMLInputElement, Step>) => {
		if (e.target.name === "quantity") {
			e.currentTarget.value = e.currentTarget.valueAsNumber.toFixed(4);
		}
	};

	return (
		<>
			<Button
				text={t("addStep", {
					defaultValue: "Add  Step",
				})}
				icon={Icons.Edit.PlusSmall}
				style="tertiary"
				onClick={setOpenModal}
			/>
			<Modal isOpen={openModal}>
				<h2 className="typo-h3 mb-12">
					{t("addAnStep", {
						defaultValue: "Add an  Step",
					})}
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
							const nextValue = [...next.value];

							nextValue.push({
								StepID: Number(stepData.ID),
								Every: Number(every),
								PerBatch: perBatch === "yes",
								Quantity: Number(quantity),
								_Step: stepData,
							});

							next.value = nextValue;

							return next;
						});

						formHasChanged("AdditionalSteps");
						setOpenModal();
					}}
				>
					<AutoComplete
						control={control}
						error={errors.step}
						htmlFor={"step"}
						label={t("code")}
						name="step"
						options={steps}
						optionLabelKeys="Code"
					/>
					<Input
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
								defaultValue="no"
								control={control}
								error={errors.perBatch}
								horizontal
							/>
						</div>
					</div>
					<div className="flex justify-end items-center mt-12 gap-6">
						<Button
							style="secondary"
							text={t("cancel")}
							onClick={setOpenModal}
						/>
						<Button text={t("create")} type="submit" />
					</div>
				</form>
			</Modal>
		</>
	);
};
