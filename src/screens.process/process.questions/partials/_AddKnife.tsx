import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import Icons from "../../../config.common/Icons";
import { CheckableList } from "../../../forms.common/CheckableList";
import { Input } from "../../../forms.common/Input";
import { useToggle } from "../../../hooks.common/useToggle";
import { useProcessKnivesFormSchema } from "../../../hooks.schema/forms";
import { QuestionsContext } from "./_QuestionsContext";

export const AddKnife = () => {
	const processKnivesFormSchema = useProcessKnivesFormSchema();
	type ProcessKnivesFormData = z.infer<typeof processKnivesFormSchema>;
	const [openModal, setOpenModal] = useToggle(false);

	const { setKnivesQuestionsState, formHasChanged } =
		useContext(QuestionsContext);
	const { t } = useTranslation();
	const {
		getValues,
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(processKnivesFormSchema),
	});
	const onSubmit = (data: ProcessKnivesFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	useEffect(() => {
		if (openModal) {
			reset();
		}
	}, [openModal, reset]);

	return (
		<>
			<Button
				text={t("addKnife", {
					defaultValue: "Add Knife",
				})}
				icon={Icons.Edit.PlusSmall}
				style="tertiary"
				onClick={setOpenModal}
			/>
			<Modal isOpen={openModal}>
				<h2 className="typo-h3 mb-12">
					{t("addAKnife", {
						defaultValue: "Add a Knife",
					})}
				</h2>
				<form
					onSubmit={(e) => {
						if (!isValid) {
							handleSubmit(onSubmit, onSubmitError)(e);

							return;
						}

						e.preventDefault();

						const {
							bands,
							clears,
							cutsLR,
							description,
							freq,
							marks,
							nettArea,
							peels,
							pieces,
							thin,
						} = getValues();

						setKnivesQuestionsState((previous) => {
							const next = { ...previous };

							next.value.push({
								Bands: Number(bands),
								Clears: Number(clears),
								CutsLR: cutsLR === "yes",
								Description: description,
								Freq: Number(freq),
								Marks: Number(marks),
								NettArea: Number(nettArea),
								Peels: Number(peels),
								Pieces: Number(pieces),
								Thin: thin === "yes",
							});

							next.value = [...next.value];

							return next;
						});

						formHasChanged(["Cutting", "Knives"]);

						setOpenModal();
					}}
				>
					<Input
						error={errors.description}
						htmlFor={"description"}
						label={t("description")}
						name="description"
						placeholder="Enter a description..."
						register={register}
					/>
					<Input
						error={errors.freq}
						htmlFor={"freq"}
						label={t("frequency")}
						name="freq"
						register={register}
						type="number"
						tooltipContent={t("tooltipOperationQuestionKnivesFreq")}
					/>
					<Input
						error={errors.nettArea}
						htmlFor={"nettArea"}
						label={t("nettArea")}
						name="nettArea"
						register={register}
						type="number"
						tooltipContent={t("tooltipOperationQuestionKnivesNett")}
					/>
					<Input
						error={errors.pieces}
						htmlFor={"pieces"}
						label={t("pieces")}
						name="pieces"
						register={register}
						type="number"
						tooltipContent={t(
							"tooltipOperationQuestionKnivesPieces"
						)}
					/>
					<Input
						error={errors.peels}
						htmlFor={"peels"}
						label={t("peels")}
						name="peels"
						register={register}
						type="number"
						tooltipContent={t(
							"tooltipOperationQuestionKnivesPeels"
						)}
					/>
					<Input
						error={errors.clears}
						htmlFor={"clears"}
						label={t("clears")}
						name="clears"
						register={register}
						type="number"
						tooltipContent={t(
							"tooltipOperationQuestionKnivesClears"
						)}
					/>
					<CheckableList
						error={errors.cutsLR}
						label={t("cutsLR")}
						items={[
							{
								htmlFor: "yes",
								label: t("yes"),
								name: "cutsLR",
								value: "yes",
							},
							{
								htmlFor: "no",
								label: t("no"),
								name: "cutsLR",
								value: "no",
							},
						]}
						register={register}
						type="radio"
						tooltipContent={t("tooltipOperationQuestionKnivesLtoR")}
					/>
					<CheckableList
						error={errors.thin}
						label={t("tool")}
						items={[
							{
								htmlFor: "thin-yes",
								label: t("yes"),
								name: "thin",
								value: "yes",
							},
							{
								htmlFor: "thin-no",
								label: t("no"),
								name: "thin",
								value: "no",
							},
						]}
						register={register}
						type="radio"
						tooltipContent={t("tooltipOperationQuestionKnivesThin")}
					/>
					<Input
						error={errors.bands}
						htmlFor={"bands"}
						label={t("bands")}
						name="bands"
						register={register}
						type="number"
						tooltipContent={t(
							"tooltipOperationQuestionKnivesBands"
						)}
					/>
					<Input
						error={errors.marks}
						htmlFor={"marks"}
						label={t("marks")}
						name="marks"
						register={register}
						type="number"
						tooltipContent={t(
							"tooltipOperationQuestionKnivesMarks"
						)}
					/>
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
