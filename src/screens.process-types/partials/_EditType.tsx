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
import { Input } from "../../forms.common/Input";
import { Select } from "../../forms.common/Select";
import { useFetcher } from "../../hooks.common/useFetcher";
import { useEditProcessTypeFormSchema } from "../../hooks.schema/forms";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import ResponseDataUtilities from "../../utilities.common/ResponseDataUtilities";
import { ProcessTypeContext } from "./_ProcessTypeContext";

export const EditType = () => {
	const processTypeFormSchema = useEditProcessTypeFormSchema();

	type ProcessTypeFormData = z.infer<typeof processTypeFormSchema>;

	const { editTypeData, openEditTypeModal, setOpenEditTypeModal } =
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
		if (openEditTypeModal) {
			reset();
		}
	}, [openEditTypeModal, reset]);

	useEffect(() => {
		if (responseData?.type === "success") {
			ResponseDataUtilities.resetResponseData(responseData);
			setOpenEditTypeModal();
		} else if (responseData?.type === "error") {
			processResponse(responseData);
			ResponseDataUtilities.resetResponseData(responseData);
		}
	}, [responseData?.type, responseData, processResponse, setOpenEditTypeModal]);

	return (
		<Modal isOpen={openEditTypeModal}>
			<h2 className="typo-h3 mb-12">
				{t("editOperationType", {
					defaultValue: "Edit the Process Type",
				})}
			</h2>
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
				<input type="hidden" value={editTypeData?.ID} name="id" />
				<input
					type="hidden"
					name={FORM_IDENTIFIERS.nameAttribute}
					value={FORM_IDENTIFIERS.updateProcessType}
				/>

				<Input
					defaultValue={editTypeData?.Description}
					error={errors.name}
					htmlFor={"name"}
					label={t("name")}
					name="name"
					register={register}
				/>
				<div className="grid grid-cols-2 gap-x-6">
					<div className="col-span-1">
						<Input
							defaultValue={editTypeData?.DefaultItemsCovered}
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
							defaultValue={editTypeData?.Rest}
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
							defaultValue={editTypeData?.Contingency}
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
							defaultValue={
								editTypeData?.GroupMember ? "yes" : "no"
							}
							control={control}
							htmlFor="groupMember"
							name="groupMember"
							label={t("groupMember")}
							options={[
								{
									label: t("yes"),
									value: "yes",
								},
								{
									label: t("no"),
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
							setOpenEditTypeModal();
						}}
					/>
					<Button
						disabled={isFetching}
						text={t("update")}
						type="submit"
					/>
				</div>
			</fetcher.Form>
		</Modal>
	);
};
