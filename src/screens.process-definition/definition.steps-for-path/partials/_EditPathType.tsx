import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { StepData } from "../../../api.common/types";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import { AutoComplete } from "../../../forms.common/AutoComplete";
import { Input } from "../../../forms.common/Input";
import { useSteps } from "../../../hooks.queries/useSteps";
import { usePathTypeFormSchema } from "../../../hooks.schema/forms";
import { DefinitionContext } from "../../definition.index/partials/_DefinitionContext";

export const EditPathType = () => {
	const {
		pathTypes,
		pathTypeActionIndex,
		openEditPathTypeModal,
		setOpenEditPathTypeModal,
		setPathTypes,
		setCanSave,
	} = useContext(DefinitionContext);
	const { steps } = useSteps();
	const { t } = useTranslation();
	const pathTypeFormSchema = usePathTypeFormSchema();
	type PathTypeFormData = z.infer<typeof pathTypeFormSchema>;

	const {
		control,
		getValues,
		handleSubmit,
		register,
		reset,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(pathTypeFormSchema),
	});

	useEffect(() => {
		if (openEditPathTypeModal) {
			reset();
		}
	}, [openEditPathTypeModal, reset]);

	if (!pathTypes?.length) {
		return <></>;
	}
	const pathType = pathTypes[Number(pathTypeActionIndex)];

	const onSubmit = (data: PathTypeFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	if (!pathType) {
		return <></>;
	}

	return (
		<Modal isOpen={openEditPathTypeModal}>
			<h2 className="typo-h3 mb-12">{t("editPathType")}</h2>
			<form
				onSubmit={(e) => {
					if (!isValid) {
						handleSubmit(onSubmit, onSubmitError)(e);

						return;
					}

					e.preventDefault();
					const {
						name,
						radii5,
						radii10,
						radii15,
						radii20,
						radii30,
						radii40,
						radii50,
						radii60,
						radii80,
						radii110,
					} = getValues();

					const radii5Step: StepData = JSON.parse(
						radii5.toString()
					);
					const radii10Step: StepData = JSON.parse(
						radii10.toString()
					);
					const radii15Step: StepData = JSON.parse(
						radii15.toString()
					);
					const radii20Step: StepData = JSON.parse(
						radii20.toString()
					);
					const radii30Step: StepData = JSON.parse(
						radii30.toString()
					);
					const radii40Step: StepData = JSON.parse(
						radii40.toString()
					);
					const radii50Step: StepData = JSON.parse(
						radii50.toString()
					);
					const radii60Step: StepData = JSON.parse(
						radii60.toString()
					);
					const radii80Step: StepData = JSON.parse(
						radii80.toString()
					);
					const radii110Step: StepData = JSON.parse(
						radii110.toString()
					);

					setPathTypes((previous) => {
						const next = [...(previous || [])];

						next[Number(pathTypeActionIndex)] = {
							Seq: next[Number(pathTypeActionIndex)].Seq,
							Name: name.toString(),
							PathtypesSteps: [
								{
									Radius: 5,
									StepID: radii5Step.ID,
									_Step: radii5Step,
								},
								{
									Radius: 10,
									StepID: radii10Step.ID,
									_Step: radii10Step,
								},
								{
									Radius: 15,
									StepID: radii15Step.ID,
									_Step: radii15Step,
								},
								{
									Radius: 20,
									StepID: radii20Step.ID,
									_Step: radii20Step,
								},
								{
									Radius: 30,
									StepID: radii30Step.ID,
									_Step: radii30Step,
								},
								{
									Radius: 40,
									StepID: radii40Step.ID,
									_Step: radii40Step,
								},
								{
									Radius: 50,
									StepID: radii50Step.ID,
									_Step: radii50Step,
								},
								{
									Radius: 60,
									StepID: radii60Step.ID,
									_Step: radii60Step,
								},
								{
									Radius: 80,
									StepID: radii80Step.ID,
									_Step: radii80Step,
								},
								{
									Radius: 110,
									StepID: radii110Step.ID,
									_Step: radii110Step,
								},
							],
						};
						return next;
					});

					setOpenEditPathTypeModal();
					setCanSave(true);
				}}
			>
				<div className="form-field__group--inline [&_label]:w-20">
					<Input
						defaultValue={pathType.Name}
						error={errors.name}
						htmlFor={"name"}
						label={t("name")}
						name="name"
						register={register}
					/>
					<AutoComplete
						key={`radii5-${pathType.PathtypesSteps[0]._Step?.Code}`}
						control={control}
						defaultValue={pathType.PathtypesSteps[0]._Step}
						error={errors.radii5}
						htmlFor={"radii5"}
						label="5"
						name="radii5"
						options={steps}
						optionLabelKeys="Code"
					/>
					<AutoComplete
						key={`radii10-${pathType.PathtypesSteps[1]._Step?.Code}`}
						control={control}
						defaultValue={pathType.PathtypesSteps[1]._Step}
						error={errors.radii10}
						htmlFor={"radii10"}
						label="10"
						name="radii10"
						options={steps}
						optionLabelKeys="Code"
					/>
					<AutoComplete
						key={`radii15-${pathType.PathtypesSteps[2]._Step?.Code}`}
						control={control}
						defaultValue={pathType.PathtypesSteps[2]._Step}
						error={errors.radii15}
						htmlFor={"radii15"}
						label="15"
						name="radii15"
						options={steps}
						optionLabelKeys="Code"
					/>
					<AutoComplete
						key={`radii20-${pathType.PathtypesSteps[3]._Step?.Code}`}
						control={control}
						defaultValue={pathType.PathtypesSteps[3]._Step}
						error={errors.radii20}
						htmlFor={"radii20"}
						label="20"
						name="radii20"
						options={steps}
						optionLabelKeys="Code"
					/>
					<AutoComplete
						key={`radii30-${pathType.PathtypesSteps[4]._Step?.Code}`}
						control={control}
						defaultValue={pathType.PathtypesSteps[4]._Step}
						error={errors.radii30}
						htmlFor={"radii30"}
						label="30"
						name="radii30"
						options={steps}
						optionLabelKeys="Code"
					/>
					<AutoComplete
						key={`radii40-${pathType.PathtypesSteps[5]._Step?.Code}`}
						control={control}
						defaultValue={pathType.PathtypesSteps[5]._Step}
						error={errors.radii40}
						htmlFor={"radii40"}
						label="40"
						name="radii40"
						options={steps}
						optionLabelKeys="Code"
					/>
					<AutoComplete
						key={`radii50-${pathType.PathtypesSteps[6]._Step?.Code}`}
						control={control}
						defaultValue={pathType.PathtypesSteps[6]._Step}
						error={errors.radii50}
						htmlFor={"radii50"}
						label="50"
						name="radii50"
						options={steps}
						optionLabelKeys="Code"
					/>
					<AutoComplete
						key={`radii60-${pathType.PathtypesSteps[7]._Step?.Code}`}
						control={control}
						defaultValue={pathType.PathtypesSteps[7]._Step}
						error={errors.radii60}
						htmlFor={"radii60"}
						label="60"
						name="radii60"
						options={steps}
						optionLabelKeys="Code"
					/>
					<AutoComplete
						key={`radii80-${pathType.PathtypesSteps[8]._Step?.Code}`}
						control={control}
						defaultValue={pathType.PathtypesSteps[8]._Step}
						error={errors.radii80}
						htmlFor={"radii80"}
						label="80"
						name="radii80"
						options={steps}
						optionLabelKeys="Code"
					/>
					<AutoComplete
						key={`radii110-${pathType.PathtypesSteps[9]._Step?.Code}`}
						control={control}
						defaultValue={pathType.PathtypesSteps[9]._Step}
						error={errors.radii110}
						htmlFor={"radii110"}
						label="110"
						name="radii110"
						options={steps}
						optionLabelKeys="Code"
					/>
				</div>
				<div className="flex justify-end items-end mt-12 gap-6">
					<Button
						style="secondary"
						text={t("cancel")}
						onClick={setOpenEditPathTypeModal}
					/>
					<Button text={t("edit")} type="submit" />
				</div>
			</form>
		</Modal>
	);
};
