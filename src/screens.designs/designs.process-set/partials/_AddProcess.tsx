import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { ProcessData } from "../../../api.common/types";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import Icons from "../../../config.common/Icons";
import { AutoComplete } from "../../../forms.common/AutoComplete";
import { useToggle } from "../../../hooks.common/useToggle";
import { useProcesses } from "../../../hooks.queries/useProcesses";
import { useProcessFieldSchema } from "../../../hooks.schema/fields";
import { ProcessSetContext } from "./_ProcessSetContext";

export const AddProcess = () => {
	const processFieldSchema = useProcessFieldSchema();
	type ProcessFormData = z.infer<typeof processFieldSchema>;

	const { processes } = useProcesses();
	const { setProcesses, setCanSave } = useContext(ProcessSetContext);
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();
	const {
		control,
		getValues,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(processFieldSchema),
	});
	const onSubmit = (data: ProcessFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	useEffect(() => {
		if (openModal) {
			reset();
		}
	}, [openModal, reset]);

	return (
		<>
			<Button
				text={t("addAProcess", {
					defaultValue: "Add an Process",
				})}
				icon={Icons.Edit.PlusSmall}
				style="tertiary"
				onClick={setOpenModal}
			/>
			<Modal isOpen={openModal}>
				<h2 className="typo-h3 mb-12">
					{t("addAProcess", {
						defaultValue: "Add an Process",
					})}
				</h2>
				<form
					onSubmit={(e) => {
						if (!isValid) {
							handleSubmit(onSubmit, onSubmitError)(e);

							return;
						}

						e.preventDefault();

						const { process } = getValues();

						const processData: ProcessData =
							JSON.parse(process);

						setProcesses((previous) => {
							const next = [...(previous || [])];
							next.push({
								ProcessID: processData.ID as number,
								Seq: next.length + 1,
								_Operation: processData,
							});
							return next;
						});

						setCanSave(true);
						setOpenModal();
					}}
				>
					<AutoComplete
						control={control}
						error={errors.process}
						htmlFor={"step"}
						label={t("search")}
						name="process"
						options={processes}
						optionLabelKeys={["Code", "Description"]}
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
