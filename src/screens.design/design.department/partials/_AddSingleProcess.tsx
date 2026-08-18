import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { ProcessData } from "../../../api.common/types";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import { AutoComplete } from "../../../forms.common/AutoComplete";
import { useProcessesFiltered } from "../../../hooks.queries/useProcessesFiltered";
import { useProcessFieldSchema } from "../../../hooks.schema/fields";
import { DesignDepartmentContext } from "./_DesignDepartmentContext";
import { useDesignDepartment } from "../../../hooks.queries/useDesignDepartment";

type GetProcessesProps = {
	setProcesses: Dispatch<SetStateAction<ProcessData[]>>;
};

const GetProcesses = ({ setProcesses }: GetProcessesProps) => {
	const styleDepartment = useDesignDepartment();

	const { filteredProcesses } = useProcessesFiltered({
		deptID: styleDepartment?._Department?.ID,
		concise: true,
	});
	const filteredProcessesSerialized = JSON.stringify(filteredProcesses);
	useEffect(() => {
		setProcesses(filteredProcesses);
	}, [filteredProcessesSerialized, setProcesses]); // eslint-disable-line react-hooks/exhaustive-deps
	return <></>;
};

export const AddSingleProcessButton = ({ index }: { index?: number }) => {
	const { setOpenSingleModal, setInsertIndex } = useContext(
		DesignDepartmentContext
	);
	const { t } = useTranslation();

	return (
		<button
			type="button"
			onClick={() => {
				setInsertIndex(index);
				setOpenSingleModal();
			}}
		>
			{t("single")}
		</button>
	);
};

export const AddSingleProcess = () => {
	const processFieldSchema = useProcessFieldSchema();
	type ProcessFormData = z.infer<typeof processFieldSchema>;

	const [processes, setProcessesList] = useState<ProcessData[]>([]);
	const {
		setCanSave,
		setStyleProcesses,
		openSingleModal,
		setOpenSingleModal,
		insertIndex,
		setInsertIndex,
	} = useContext(DesignDepartmentContext);
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
		if (openSingleModal) {
			reset();
		} else {
			setInsertIndex(undefined);
		}
	}, [openSingleModal, reset, setInsertIndex]);

	return (
		<Modal isOpen={openSingleModal}>
			<GetProcesses setProcesses={setProcessesList} />
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

					setStyleProcesses((previous) => {
						const newIndex = insertIndex ?? previous.length;
						const newItem = {
							ID: -previous.length - 1,
							ProcessID: processData.ID as number,
							Seq: newIndex + 1,
							_Operation: processData,
						};
						const next = previous.map((item, index) => {
							return {
								...item,
								Seq:
									index >= newIndex ? item.Seq + 1 : item.Seq,
							};
						});

						next.splice(newIndex, 0, newItem);

						return next;
					});

					setCanSave(true);
					setOpenSingleModal();
				}}
			>
				{processes && (
					<AutoComplete
						control={control}
						error={errors.process}
						htmlFor={"step"}
						label={t("search")}
						name="process"
						options={processes}
						optionLabelKeys={["Code", "Description"]}
					/>
				)}
				<div className="flex justify-end items-center mt-12 gap-6">
					<Button
						style="secondary"
						text={t("cancel")}
						onClick={setOpenSingleModal}
					/>
					<Button text={t("create")} type="submit" />
				</div>
			</form>
		</Modal>
	);
};
