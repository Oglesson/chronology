import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "../../components/common/button/Button";
import Icons from "../../config.common/Icons";
import { NotificationContext } from "../../context.common/NotificationContext";
import { Input } from "../../forms.common/Input";
import { Select } from "../../forms.common/Select";
import { useFetcher } from "../../hooks.common/useFetcher";
import { useDepartments } from "../../hooks.queries/useDepartments";
import { useProcessTypes } from "../../hooks.queries/useProcessTypes";
import { useProcessFormSchema } from "../../hooks.schema/forms";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import { ProcessesContext } from "./_ProcessesContext";
import { useProcesses } from "../../hooks.queries/useProcesses";
import { useDesigns } from "../../hooks.queries/useDesigns";
import ResponseDataUtilities from "../../utilities.common/ResponseDataUtilities";

export const Create = () => {
	const { processCodes } = useProcesses();
	const processFormSchema = useProcessFormSchema(processCodes);
	const { departmentOptions } = useDepartments();
	const { stylesList } = useDesigns();
	const { groupedProcessTypes } = useProcessTypes();
	type ProcessFormData = z.infer<typeof processFormSchema>;

	const { setOpenModalContent } = useContext(ProcessesContext);
	const { t } = useTranslation();
	const {
		control,
		getValues,
		register,
		handleSubmit,
		reset,
		resetField,
		watch,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(processFormSchema),
	});
	const onSubmit = (data: ProcessFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	const { fetcher, isFetching, responseData } = useFetcher();
	const { addNotification, removeNotification, processResponse } =
		useContext(NotificationContext);

	// eslint-disable-next-line react-hooks/incompatible-library
	const processClass = watch("processClass");
	const processTypes = processClass
		? groupedProcessTypes[processClass]
		: [];

	useEffect(() => {
		resetField("processType");
	}, [processClass, resetField]);

	useEffect(() => {
		reset();
	}, [reset]);
	const { code } = getValues();

	useEffect(() => {
		if (responseData?.type === "error") {
			removeNotification(code);
			processResponse(responseData);
			ResponseDataUtilities.resetResponseData(responseData);
		}
	}, [responseData, code, removeNotification, processResponse]);

	useEffect(() => {
		if (fetcher?.state === "submitting") {
			addNotification({
				dismissDisabled: true,
				duration: 0,
				id: code,
				message: `Creating Process with code ${code.toUpperCase()}...`,
				heading: "Creating Process",
			});
		}
	}, [fetcher, code, addNotification]);

	return (
		<>
			<h2 className="typo-h3 mb-12">{t("createAProcess")}</h2>
			<fetcher.Form
				method="post"
				action=""
				onSubmit={(e) => {
					if (!isValid) {
						handleSubmit(onSubmit, onSubmitError)(e);

						return;
					}
				}}
			>
				<Input
					error={errors.code}
					htmlFor={"code"}
					label={t("code")}
					name="code"
					placeholder="Enter a code..."
					register={register}
					tooltipContent={t("tooltipOperationCode")}
				/>
				<Input
					error={errors.description}
					htmlFor={"description"}
					label={t("description")}
					name="description"
					placeholder="Enter a description..."
					register={register}
					tooltipContent={t("tooltipOperationDescription")}
				/>
				<Select
					control={control}
					name="processClass"
					error={errors.processClass}
					htmlFor="processClass"
					label="Class"
					options={Object.entries(groupedProcessTypes).map(
						([key]) => {
							return {
								label: key,
								value: key,
							};
						}
					)}
					placeholder="Select a class..."
					maxHeight={210}
					tooltipContent={t("tooltipOperationOperationClass")}
				/>
				<Select
					control={control}
					name="processType"
					error={errors.processType}
					htmlFor="processType"
					label="Type"
					options={processTypes.map((type) => {
						return {
							label: type.Description,
							value: type.ID,
						};
					})}
					placeholder={
						processTypes.length
							? "Select a type..."
							: "Select a class first..."
					}
					maxHeight={210}
					tooltipContent={t("tooltipOperationOperationType")}
				/>
				<Select
					control={control}
					name="department"
					error={errors.department}
					htmlFor="department"
					label={t("department")}
					options={departmentOptions}
					placeholder="Select a department..."
					tooltipContent={t("tooltipOperationDepartment")}
				/>
				<Select
					control={control}
					error={errors.mainDesign}
					name="mainDesign"
					htmlFor="mainDesign"
					label={t("mainDesign")}
					options={stylesList}
					placeholder={t("mainDesignPlaceholder") ?? ""}
					tooltipContent={t("tooltipOperationMainstyle")}
				/>
				<div className="flex justify-end items-center mt-12 gap-6">
					{isFetching && (
						<RenderIcon
							classes="animate-spin-slow"
							icon={Icons.Interface.Loading}
						/>
					)}
					<Button
						disabled={isFetching}
						style="secondary"
						text={t("cancel")}
						onClick={() => setOpenModalContent(null)}
					/>
					<Button
						disabled={isFetching}
						text={t("create")}
						type="submit"
					/>
				</div>
			</fetcher.Form>
		</>
	);
};
