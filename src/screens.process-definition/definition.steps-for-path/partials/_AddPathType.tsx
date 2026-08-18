import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { StepData } from "../../../api.common/types";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import Icons from "../../../config.common/Icons";
import { AutoComplete } from "../../../forms.common/AutoComplete";
import { Input } from "../../../forms.common/Input";
import { useToggle } from "../../../hooks.common/useToggle";
import { useSteps } from "../../../hooks.queries/useSteps";
import { useProcessDefinition } from "../../../hooks.queries/useProcessDefinition";
import { usePathTypeFormSchema } from "../../../hooks.schema/forms";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import { DefinitionContext } from "../../definition.index/partials/_DefinitionContext";

export const AddPathType = () => {
	const { pathTypes, setPathTypes, setCanSave } =
		useContext(DefinitionContext);
	const definition = useProcessDefinition();
	const pathTypeFormSchema = usePathTypeFormSchema();
	type PathTypeFormData = z.infer<typeof pathTypeFormSchema>;

	const { steps } = useSteps();
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();
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
	const onSubmit = (data: PathTypeFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	useEffect(() => {
		if (openModal) {
			reset();
		}
	}, [openModal, reset]);

	if (!pathTypes || pathTypes.length >= 6) {
		return <></>;
	}

	return (
		<div>
			{pathTypes.length < 1 && (
				<p className="typo-h5 mt-4 mb-10">{t("addFirstPathSummary")}</p>
			)}
			<button
				className={
					"flex items-center justify-center w-8 h-8 mt-3 rounded-sm bg-grey-lightest dark:bg-black-subtle " +
					(definition.IsInUseByOp
						? "opacity-50"
						: "transition-colors duration-100 ease-hover hover:bg-grey-lighter dark:hover:bg-black")
				}
				onClick={setOpenModal}
				type="button"
				disabled={definition.IsInUseByOp}
			>
				<span className="sr-only">{t("addPathType")}</span>
				<RenderIcon icon={Icons.Edit.Plus} />
			</button>
			<Modal isOpen={openModal}>
				<h2 className="typo-h3 mb-12">{t("addPathType")}</h2>
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

							next.push({
								Seq: next.length + 1,
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
							});
							return next;
						});

						setOpenModal();
						setCanSave(true);
					}}
				>
					<div className="form-field__group--inline [&_label]:w-20">
						<Input
							error={errors.name}
							htmlFor={"name"}
							label={t("name")}
							name="name"
							register={register}
						/>
						<AutoComplete
							control={control}
							error={errors.radii5}
							htmlFor={"radii5"}
							label="5"
							name="radii5"
							options={steps}
							optionLabelKeys="Code"
						/>
						<AutoComplete
							control={control}
							error={errors.radii10}
							htmlFor={"radii10"}
							label="10"
							name="radii10"
							options={steps}
							optionLabelKeys="Code"
						/>
						<AutoComplete
							control={control}
							error={errors.radii15}
							htmlFor={"radii15"}
							label="15"
							name="radii15"
							options={steps}
							optionLabelKeys="Code"
						/>
						<AutoComplete
							control={control}
							error={errors.radii20}
							htmlFor={"radii20"}
							label="20"
							name="radii20"
							options={steps}
							optionLabelKeys="Code"
						/>
						<AutoComplete
							control={control}
							error={errors.radii30}
							htmlFor={"radii30"}
							label="30"
							name="radii30"
							options={steps}
							optionLabelKeys="Code"
						/>
						<AutoComplete
							control={control}
							error={errors.radii40}
							htmlFor={"radii40"}
							label="40"
							name="radii40"
							options={steps}
							optionLabelKeys="Code"
						/>
						<AutoComplete
							control={control}
							error={errors.radii50}
							htmlFor={"radii50"}
							label="50"
							name="radii50"
							options={steps}
							optionLabelKeys="Code"
						/>
						<AutoComplete
							control={control}
							error={errors.radii60}
							htmlFor={"radii60"}
							label="60"
							name="radii60"
							options={steps}
							optionLabelKeys="Code"
						/>
						<AutoComplete
							control={control}
							error={errors.radii80}
							htmlFor={"radii80"}
							label="80"
							name="radii80"
							options={steps}
							optionLabelKeys="Code"
						/>
						<AutoComplete
							control={control}
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
							onClick={setOpenModal}
						/>
						<Button text={t("create")} type="submit" />
					</div>
				</form>
			</Modal>
		</div>
	);
};
