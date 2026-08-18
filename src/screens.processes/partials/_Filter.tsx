import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { ProcessData } from "../../api.common/types";
import { Button } from "../../components/common/button/Button";
import { Select } from "../../forms.common/Select";
import { useDepartments } from "../../hooks.queries/useDepartments";
import { useProcesses } from "../../hooks.queries/useProcesses";
import { useProcessTypes } from "../../hooks.queries/useProcessTypes";
import { ProcessesContext } from "./_ProcessesContext";
import ObjectUtilities from "../../utilities.common/ObjectUtilities";

type FilterProps = {
	setFilteredProcesses: Dispatch<SetStateAction<ProcessData[]>>;
};

export const Filter = ({ setFilteredProcesses }: FilterProps) => {
	const filterSchema = z.object({
		department: z.union([z.string(), z.literal("All")]).optional(),
		processClass: z.union([z.string(), z.literal("All")]).optional(),
		processType: z
			.union([z.string(), z.literal("All"), z.literal("")])
			.optional(),
	});

	const { processes } = useProcesses();
	const { departmentFilterOptions } = useDepartments();
	const { groupedProcessTypes } = useProcessTypes();
	type FilterFormData = z.infer<typeof filterSchema>;

	const {
		setOpenModalContent,
		setOpenModalSettings,
		defaultFilterValues,
		setFilterValues,
		filterValues,
	} = useContext(ProcessesContext);

	const {
		control,
		handleSubmit,
		reset,
		getValues,
		setValue,
		watch,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(filterSchema),
	});
	const onSubmit = (data: FilterFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	const { t } = useTranslation();

	// eslint-disable-next-line react-hooks/incompatible-library
	const processClass = watch("processClass");
	const processTypes =
		processClass && processClass !== "All"
			? [
					{ label: "All", value: "All" },
					...groupedProcessTypes[processClass].map((type) => {
						return {
							label: type.Description,
							value: type.Description,
						};
					}),
			  ]
			: [];

	const resetForm = () => {
		reset(defaultFilterValues);
		setFilterValues(defaultFilterValues);
	};
	useEffect(() => {
		setValue(
			"processType",
			processClass === "All"
				? ("" as unknown as string)
				: filterValues.processType &&
				  filterValues.processType !== ""
				? filterValues.processType
				: "All"
		);
	}, [processClass, filterValues.processType, setValue]);

	useEffect(() => {
		reset(filterValues);
	}, [filterValues, reset]);

	return (
		<>
			<form
				className="flex flex-col min-h-full"
				onSubmit={(e) => {
					if (!isValid) {
						handleSubmit(onSubmit, onSubmitError)(e);

						return;
					}
					e.preventDefault();

					const formValues = getValues();
					const { department, processClass, processType } =
						getValues();

					const filteredProcesses = processes.filter(
						(process) =>
							(department === "All" ||
								process._Department_Description ===
									department) &&
							(processClass === "All" ||
								process._Type_Class_Description ===
									processClass) &&
							(processType === "" ||
								processType === "All" ||
								process._Type_Description === processType)
					);
					setFilteredProcesses(filteredProcesses);
					setFilterValues(formValues);
					setOpenModalSettings(null);
					setOpenModalContent(null);
				}}
			>
				<h2 className="typo-h3 mb-6">{t("filter")} Processes</h2>
				<Select
					control={control}
					defaultValue={defaultFilterValues.department}
					name="department"
					error={errors.department}
					htmlFor="department"
					label={t("department")}
					options={[
						{ label: "All", value: "All" },
						...departmentFilterOptions,
					]}
					placeholder={`${t("selectADept")}...`}
				/>
				<Select
					control={control}
					defaultValue={defaultFilterValues.processClass}
					name="processClass"
					error={errors.processClass}
					htmlFor="processClass"
					label="Class"
					options={[
						{ label: "All", value: "All" },
						...Object.entries(groupedProcessTypes).map(
							([key]) => {
								return {
									label: key,
									value: key,
								};
							}
						),
					]}
					placeholder={`${t("selectAClass")}...`}
					maxHeight={210}
					disabled={ObjectUtilities.objIsEmpty(groupedProcessTypes)}
				/>
				<Select
					control={control}
					defaultValue={defaultFilterValues.processType}
					name="processType"
					error={errors.processType}
					htmlFor="processType"
					label="Type"
					options={processTypes}
					placeholder={
						processTypes.length
							? `${t("selectAType")}...`
							: `${t("filterByClassFirst")}...`
					}
					maxHeight={210}
				/>

				<div className="flex justify-end items-end mt-auto pt-12 gap-6">
					<Button
						style="secondary"
						text={t("cancel")}
						onClick={() => {
							setOpenModalSettings(null);
							setOpenModalContent(null);
						}}
					/>
					<Button
						style="secondary"
						text={t("reset")}
						onClick={resetForm}
					/>
					<Button text={t("apply")} type="submit" />
				</div>
			</form>
		</>
	);
};
