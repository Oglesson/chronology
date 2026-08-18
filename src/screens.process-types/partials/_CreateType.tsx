import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "../../components/common/button/Button";
import { Modal } from "../../components/modal/Modal";
import Icons from "../../config.common/Icons";
import { FORM_IDENTIFIERS } from "../../constants.common/formIdentifiers";
import { NotificationContext } from "../../context.common/NotificationContext";
import { AutoComplete } from "../../forms.common/AutoComplete";
import { Input } from "../../forms.common/Input";
import { Select } from "../../forms.common/Select";
import { useFetcher } from "../../hooks.common/useFetcher";
import { useProcessCategories } from "../../hooks.queries/useProcessCategories";
import { useProcessDefinitions } from "../../hooks.queries/useProcessDefinitions";
import { useCreateProcessTypeFormSchema } from "../../hooks.schema/forms";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import ResponseDataUtilities from "../../utilities.common/ResponseDataUtilities";
import { ProcessTypeContext } from "./_ProcessTypeContext";

type CreateTypeProps = {
	classId: number;
};

export const CreateType = ({ classId, ...props }: CreateTypeProps) => {
	const { setCreateTypeClassId, setOpenCreateTypeModal } =
		useContext(ProcessTypeContext);
	const { t } = useTranslation();

	const handleClick = () => {
		setCreateTypeClassId(classId);
		setOpenCreateTypeModal();
	};

	return (
		<div {...props} className="mt-6 first:mt-0">
			<button
				type="button"
				className="interaction:bg-white button button--primary button--circle"
				onClick={handleClick}
			>
				<span className="sr-only">{t("createAProcessType")}</span>
				<RenderIcon icon={Icons.Edit.PlusSmall} sizes="w-3.5 h-3.5" />
			</button>
		</div>
	);
};

export const CreateTypeModal = () => {
	const { processCategoryOptions } = useProcessCategories();
	const { processDefinitions } = useProcessDefinitions();
	const processTypeFormSchema = useCreateProcessTypeFormSchema();

	type ProcessTypeFormData = z.infer<typeof processTypeFormSchema>;

	const { createTypeClassId, openCreateTypeModal, setOpenCreateTypeModal } =
		useContext(ProcessTypeContext);
	const { processResponse } = useContext(NotificationContext);
	const { t } = useTranslation();

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(processTypeFormSchema),
	});
	const onSubmit = (data: ProcessTypeFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	const { fetcher, isFetching, responseData } = useFetcher();

	useEffect(() => {
		if (openCreateTypeModal) {
			reset();
		}
	}, [openCreateTypeModal, reset]);

	useEffect(() => {
		if (responseData?.type === "success") {
			ResponseDataUtilities.resetResponseData(responseData);
			setOpenCreateTypeModal();
		} else if (responseData?.type === "error") {
			processResponse(responseData);
			ResponseDataUtilities.resetResponseData(responseData);
		}
	}, [responseData?.type, responseData, processResponse, setOpenCreateTypeModal]);

	return (
		<Modal isOpen={openCreateTypeModal}>
			<h2 className="typo-h3 mb-12">{t("createAProcessType")}</h2>
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
				<input
					type="hidden"
					name={FORM_IDENTIFIERS.nameAttribute}
					value={FORM_IDENTIFIERS.createProcessType}
				/>
				{createTypeClassId && (
					<input
						type="hidden"
						value={createTypeClassId}
						name="classId"
					/>
				)}
				<Input
					error={errors.name}
					htmlFor={"name"}
					label={t("name")}
					name="name"
					register={register}
				/>
				<Select
					control={control}
					name="processCategory"
					error={errors.processCategory}
					htmlFor="processCategory"
					label={t("category")}
					options={processCategoryOptions}
				/>
				<AutoComplete
					control={control}
					error={errors.handlingProcessDefinition}
					htmlFor={"handlingProcessDefinition"}
					label={t("handlingDefinition")}
					name="handlingProcessDefinition"
					options={processDefinitions.filter((od) => od.Handling)}
					optionLabelKeys="Code"
				/>
				<AutoComplete
					control={control}
					error={errors.taskProcessDefinition}
					htmlFor={"taskProcessDefinition"}
					label={t("taskDefinition")}
					name="taskProcessDefinition"
					options={processDefinitions.filter((od) => !od.Handling)}
					optionLabelKeys="Code"
				/>
				<div className="grid grid-cols-2 gap-x-6">
					<div className="col-span-1">
						<Input
							register={register}
							htmlFor="defaultItemsCovered"
							name="defaultItemsCovered"
							label={t("itemsCovered")}
							type="number"
							error={errors.defaultItemsCovered}
							placeholder={`${t("enterAValue")}...`}
						/>
					</div>
					<div className="col-span-1">
						<Input
							register={register}
							htmlFor="rest"
							name="rest"
							label={t("rest")}
							type="number"
							error={errors.rest}
							placeholder={`${t("enterAValue")}...`}
						/>
					</div>
					<div className="col-span-1">
						<Input
							register={register}
							htmlFor="contingency"
							name="contingency"
							label={t("contingency")}
							type="number"
							error={errors.contingency}
							placeholder={`${t("enterAValue")}...`}
						/>
					</div>
					<div className="col-span-1">
						<Select
							control={control}
							htmlFor="groupMember"
							name="groupMember"
							label={t("groupMember")}
							options={[
								{
									value: "yes",
								},
								{
									value: "no",
								},
							]}
							error={errors.groupMember}
							placeholder={`${t("selectAValue")}...`}
						/>
					</div>
				</div>
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
						onClick={() => {
							setOpenCreateTypeModal();
						}}
					/>
					<Button
						disabled={isFetching}
						text={t("create")}
						type="submit"
					/>
				</div>
			</fetcher.Form>
		</Modal>
	);
};
