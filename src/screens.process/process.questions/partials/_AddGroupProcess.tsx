import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { ProcessData } from "../../../api.common/types";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import { AutoComplete } from "../../../forms.common/AutoComplete";
import {
	useMannedProcessFieldSchema,
	useUnmannedProcessFieldSchema,
} from "../../../hooks.schema/fields";
import { GroupProcessModalDataProps } from "./_GroupProcessesQuestions";
import { QuestionsContext } from "./_QuestionsContext";

type AddGroupProcessProps = {
	modalData: GroupProcessModalDataProps;
	openModal: boolean;
	setOpenModal: () => void;
};

export const AddGroupProcess = ({
	modalData,
	openModal,
	setOpenModal,
	...props
}: AddGroupProcessProps) => {
	const mannedProcessFieldSchema = useMannedProcessFieldSchema();
	const unmannedProcessFieldSchema = useUnmannedProcessFieldSchema();
	type processFormData =
		| z.infer<typeof mannedProcessFieldSchema>
		| z.infer<typeof unmannedProcessFieldSchema>;

	const { setGroupProcessesQuestionsState, formHasChanged } =
		useContext(QuestionsContext);
	const { t } = useTranslation();

	const { index, isManned, processes } = modalData;

	const nonGroupProcesses = processes.filter((process) => {
		return process.CategoryKind !== "ocGroup";
	});

	const {
		control,
		getValues,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<processFormData>({
		resolver: zodResolver(
			isManned ? mannedProcessFieldSchema : unmannedProcessFieldSchema
		),
	});
	const onSubmit = (data: processFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	useEffect(() => {
		if (openModal) {
			reset();
		}
	}, [openModal, reset]);

	return (
		<Modal isOpen={openModal} {...props}>
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
					const processData: ProcessData = JSON.parse(process);

					setGroupProcessesQuestionsState((previous) => {
						const next = [...previous];
						next[index] = {
							...next[index],
							Seq: index + 1,
							Group_OperationID: processData.ID,
							_GroupOperation: processData,
						};

						return next;
					});

					formHasChanged("Group");

					setOpenModal();
				}}
			>
				<AutoComplete
					control={control}
					error={errors.process}
					htmlFor={"process"}
					label={t("search")}
					name="process"
					options={nonGroupProcesses}
					optionLabelKeys="Code"
				/>
				<div className="flex justify-end items-center mt-12 gap-6">
					<Button
						style="secondary"
						text={t("cancel")}
						onClick={setOpenModal}
					/>
					<Button text={t("add")} type="submit" />
				</div>
			</form>
		</Modal>
	);
};
