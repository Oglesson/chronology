import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import Icons from "../../../config.common/Icons";
import { NotificationContext } from "../../../context.common/NotificationContext";
import { Input } from "../../../forms.common/Input";
import { useFetcher } from "../../../hooks.common/useFetcher";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";
import { useToggle } from "../../../hooks.common/useToggle";
import { useDepartments } from "../../../hooks.queries/useDepartments";
import { useDepartmentsFormSchema } from "../../../hooks.schema/forms";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import ResponseDataUtilities from "../../../utilities.common/ResponseDataUtilities";
import { SystemContext } from "../../Layout";

export const Create = () => {
	const { departments } = useDepartments();
	const departmentFormSchema = useDepartmentsFormSchema(departments);
	type DepartmentFormData = z.infer<typeof departmentFormSchema>;

	const [openModal, setOpenModal] = useToggle(false);
	const { setCreateButton } = useContext(SystemContext);
	const { processResponse } = useContext(NotificationContext);
	const { permissions } = usePermissionsContext();
	const canEdit = permissions?.edit || permissions?.admin;

	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(departmentFormSchema),
	});
	const onSubmit = (data: DepartmentFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);
	const { fetcher, isFetching, responseData } = useFetcher();

	useEffect(() => {
		window.requestAnimationFrame(() => {
			setCreateButton(
				<Button text={t("createADepartment")} onClick={setOpenModal} disabled={!canEdit} />
			);
		});
	}, [setCreateButton, setOpenModal, t, canEdit]);

	useEffect(() => {
		if (responseData?.type === "success") {
			ResponseDataUtilities.resetResponseData(responseData);
			setOpenModal();
		} else if (responseData?.type === "error") {
			processResponse(responseData);
			ResponseDataUtilities.resetResponseData(responseData);
		}
	}, [responseData, processResponse, setOpenModal]);

	useEffect(() => {
		if (openModal) {
			reset();
		}
	}, [openModal, reset]);

	return (
		<>
			<button
				type="button"
				className="interaction:bg-white button button--primary button--circle disabled:opacity-30 disabled:pointer-events-none"
				onClick={setOpenModal}
				disabled={!canEdit}
			>
				<span className="sr-only">{t("create")}</span>
				<RenderIcon icon={Icons.Edit.PlusSmall} sizes="w-3.5 h-3.5" />
			</button>
			<Modal isOpen={openModal}>
				<h2 className="typo-h3 mb-12">{t("createADepartment")}</h2>
				<fetcher.Form
					method="post"
					action=""
					onSubmit={(e) => {
						if (!isValid) {
							handleSubmit(onSubmit, onSubmitError)(e);
						}
					}}
				>
					<Input
						error={errors.departmentNumber}
						htmlFor={"departmentNumber"}
						label={t("departmentNumber")}
						name="departmentNumber"
						register={register}
						type="number"
					/>
					<Input
						error={errors.description}
						htmlFor={"description"}
						label={t("description")}
						name="description"
						register={register}
					/>
					<Input
						error={errors.batchSize}
						htmlFor={"batchSize"}
						label={t("batchSize")}
						name="batchSize"
						register={register}
						type="number"
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
							onClick={setOpenModal}
						/>
						<Button
							disabled={isFetching}
							text={t("create")}
							type="submit"
						/>
					</div>
				</fetcher.Form>
			</Modal>
		</>
	);
};
