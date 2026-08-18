import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosResponse } from "axios";
import {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ProcessSetData } from "../../../api.common/types";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import { queryClient } from "../../../context.common/GlobalContext";
import { AutoComplete } from "../../../forms.common/AutoComplete";
import { useProcessSets } from "../../../hooks.queries/useProcessSets";
import { useProcessSetFieldSchema } from "../../../hooks.schema/fields";
import { processSetQuery } from "../../../queries.common/processSetQuery";
import { DesignDepartmentContext } from "./_DesignDepartmentContext";

type GetProcessSetsProps = {
	setProcessSets: Dispatch<SetStateAction<ProcessSetData[]>>;
};

const GetProcessSets = ({ setProcessSets }: GetProcessSetsProps) => {
	const { processSets } = useProcessSets();
	const processSetsSerialized = JSON.stringify(processSets);
	useEffect(() => {
		setProcessSets(processSets);
	}, [processSetsSerialized, setProcessSets]); // eslint-disable-line react-hooks/exhaustive-deps
	return <></>;
};

export const AddProcessSetButton = ({ index }: { index?: number }) => {
	const { setOpenSetModal, setInsertIndex } = useContext(
		DesignDepartmentContext
	);
	const { t } = useTranslation();

	return (
		<button
			type="button"
			onClick={() => {
				setInsertIndex(index);
				setOpenSetModal();
			}}
		>
			{t("fromSet")}
		</button>
	);
};

export const AddProcessSet = () => {
	const processSetFieldSchema = useProcessSetFieldSchema();

	const [processSets, setProcessSets] = useState<ProcessSetData[]>([]);
	const {
		setCanSave,
		setStyleProcesses,
		openSetModal,
		setOpenSetModal,
		insertIndex,
		setInsertIndex,
	} = useContext(DesignDepartmentContext);
	const { t } = useTranslation();
	const {
		control,
		getValues,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(processSetFieldSchema),
	});

	const getProcessSetQueryData = async (
		id: number
	): Promise<AxiosResponse<ProcessSetData>> => {
		const query = processSetQuery(id.toString());

		return (
			queryClient.getQueryData(query.queryKey ?? []) ??
			(await queryClient.fetchQuery(query))
		);
	};

	const onSubmit = async () => {
		const { processSet } = getValues();
		const processSetData: ProcessSetData = JSON.parse(processSet);

		const processSetResult = await getProcessSetQueryData(
			processSetData.ID!
		);

		if (processSetResult.status !== 200) {
			setOpenSetModal();
			return;
		}

		setStyleProcesses((previous) => {
			const newIndex = insertIndex ?? previous.length;
			const newArray =
				processSetResult.data.Processes?.map((process, index) => {
					return {
						ID: -previous.length - index - 1,
						ProcessID: process.ProcessID,
						Seq: newIndex + index + 1,
						_Operation: process._Operation,
					};
				}) || [];

			const next = previous.map((item, index) => {
				return {
					...item,
					Seq:
						index >= newIndex
							? item.Seq + newArray.length
							: item.Seq,
				};
			});

			next.splice(newIndex, 0, ...newArray);

			return next;
		});

		setCanSave(true);
		setOpenSetModal();
	};
	const onSubmitError = (data: object) => console.error(data);

	useEffect(() => {
		if (openSetModal) {
			reset();
		} else {
			setInsertIndex(undefined);
		}
	}, [openSetModal, reset, setInsertIndex]);

	return (
		<Modal isOpen={openSetModal}>
			<GetProcessSets setProcessSets={setProcessSets} />
			<h2 className="typo-h3 mb-12">
				{t("addProcesssFromAnOperationSet", {
					defaultValue: "Add Processes from an Process Set",
				})}
			</h2>
			<form onSubmit={(e) => handleSubmit(onSubmit, onSubmitError)(e)}>
				{processSets && (
					<AutoComplete
						control={control}
						error={errors.processSet}
						htmlFor={"step"}
						label={t("search")}
						name="processSet"
						options={processSets}
						optionLabelKeys="Code"
					/>
				)}
				<div className="flex justify-end items-center mt-12 gap-6">
					<Button
						style="secondary"
						text={t("cancel")}
						onClick={setOpenSetModal}
					/>
					<Button text={t("create")} type="submit" />
				</div>
			</form>
		</Modal>
	);
};
