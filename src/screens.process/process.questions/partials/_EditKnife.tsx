import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import { CheckableList } from "../../../forms.common/CheckableList";
import { Input } from "../../../forms.common/Input";
import { useToggle } from "../../../hooks.common/useToggle";
import { useProcessKnivesFormSchema } from "../../../hooks.schema/forms";
import { QuestionsContext } from "./_QuestionsContext";

type EditKnifeProps = {
	index: number;
};

export const EditKnife = ({ index }: EditKnifeProps) => {
	const { knivesQuestionsState, setKnivesQuestionsState, formHasChanged } =
		useContext(QuestionsContext);
	const knife = knivesQuestionsState.value[index];
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();
	const processKnivesFormSchema = useProcessKnivesFormSchema();
	type ProcessKnivesFormData = z.infer<typeof processKnivesFormSchema>;
	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(processKnivesFormSchema),
	});
	const onSubmit = (data: ProcessKnivesFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	return (
		<>
			<button type="button" onClick={setOpenModal}>
				{t("editKnife", {
					defaultValue: "Edit Knife",
				})}
			</button>
			<Modal isOpen={openModal}>
				<h2 className="typo-h3 mb-12">
					{t("editKnife", { defaultValue: "Edit Knife" })}
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

							next.value[index] = {
								...next.value[index],
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
							};

							return next;
						});

						formHasChanged(["Cutting", "Knives"]);

						setOpenModal();
					}}
				>
					<Input
						defaultValue={knife?.Description}
						error={errors.description}
						htmlFor={"description"}
						label={t("description")}
						name="description"
						placeholder="Enter a description..."
						register={register}
					/>
					<Input
						defaultValue={knife?.Freq}
						error={errors.freq}
						htmlFor={"freq"}
						label={t("frequency")}
						name="freq"
						register={register}
						type="number"
					/>
					<Input
						defaultValue={knife?.NettArea}
						error={errors.nettArea}
						htmlFor={"nettArea"}
						label={t("nettArea")}
						name="nettArea"
						register={register}
						type="number"
					/>
					<Input
						defaultValue={knife?.Pieces}
						error={errors.pieces}
						htmlFor={"pieces"}
						label={t("pieces")}
						name="pieces"
						register={register}
						type="number"
					/>
					<Input
						defaultValue={knife?.Peels}
						error={errors.peels}
						htmlFor={"peels"}
						label={t("peels")}
						name="peels"
						register={register}
						type="number"
					/>
					<Input
						defaultValue={knife?.Clears}
						error={errors.clears}
						htmlFor={"clears"}
						label={t("clears")}
						name="clears"
						register={register}
						type="number"
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
								isDefault: knife?.CutsLR,
							},
							{
								htmlFor: "no",
								label: t("no"),
								name: "cutsLR",
								value: "no",
								isDefault: !knife?.CutsLR,
							},
						]}
						register={register}
						type="radio"
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
								isDefault: knife?.Thin,
							},
							{
								htmlFor: "thin-no",
								label: t("no"),
								name: "thin",
								value: "no",
								isDefault: !knife?.Thin,
							},
						]}
						register={register}
						type="radio"
					/>
					<Input
						defaultValue={knife?.Bands}
						error={errors.bands}
						htmlFor={"bands"}
						label={t("bands")}
						name="bands"
						register={register}
						type="number"
					/>
					<Input
						defaultValue={knife?.Marks}
						error={errors.marks}
						htmlFor={"marks"}
						label={t("marks")}
						name="marks"
						register={register}
						type="number"
					/>
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
