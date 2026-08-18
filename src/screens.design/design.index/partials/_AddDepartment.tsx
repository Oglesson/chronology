import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import Icons from "../../../config.common/Icons";
import { FORM_IDENTIFIERS } from "../../../constants.common/formIdentifiers";
import { NotificationContext } from "../../../context.common/NotificationContext";
import { Input } from "../../../forms.common/Input";
import { Select } from "../../../forms.common/Select";
import { useFetcher } from "../../../hooks.common/useFetcher";
import { useToggle } from "../../../hooks.common/useToggle";
import { useDepartments } from "../../../hooks.queries/useDepartments";
import { useDesign } from "../../../hooks.queries/useDesign";
import { useDesignDepartmentFormSchema } from "../../../hooks.schema/forms";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import ResponseDataUtilities from "../../../utilities.common/ResponseDataUtilities";

export const AddDepartment = () => {
	const style = useDesign();
	const styleDepartmentFieldSchema = useDesignDepartmentFormSchema();
	type DesignDepartmentFormData = z.infer<typeof styleDepartmentFieldSchema>;
	const { departmentOptions } = useDepartments();
	const [openModal, setOpenModal] = useToggle(false);
	const { processResponse } = useContext(NotificationContext);
	const { t } = useTranslation();

	const options = departmentOptions.filter(
		(o) =>
			style.Departments?.find((d) => d.DepartmentID === o.value) ===
			undefined
	);

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(styleDepartmentFieldSchema),
	});
	const onSubmit = (data: DesignDepartmentFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);
	const { fetcher, isFetching, responseData } = useFetcher();

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

	if (!options || !options.length) {
		return (
			<div className="mt-6">
				<p className="flex items-center">
					<RenderIcon
						icon={Icons.Interface.Info}
						classes="flex-none mr-2.5"
					/>
					{t("addADepartmentToDesignAlert")}
				</p>
			</div>
		);
	}

	return (
		<div className="mt-6">
			<Button
				text={t("addADepartment")}
				icon={Icons.Edit.PlusSmall}
				style="tertiary"
				onClick={setOpenModal}
			/>
			<Modal isOpen={openModal}>
				<h2 className="typo-h3 mb-12">{t("addADepartment")}</h2>
				<fetcher.Form
					method="post"
					action=""
					onSubmit={(e) => {
						if (!isValid) {
							handleSubmit(onSubmit, onSubmitError)(e);
						}
					}}
				>
					<input
						type="hidden"
						name={FORM_IDENTIFIERS.nameAttribute}
						value={FORM_IDENTIFIERS.createDesignDepartment}
					/>
					<Select
						control={control}
						name="department"
						error={errors.department}
						htmlFor="department"
						label={t("department")}
						options={options}
						placeholder="Select a department..."
					/>
					<Input
						error={errors.batchSize}
						htmlFor={"batchSize"}
						label={t("batchSize")}
						name="batchSize"
						register={register}
						type="number"
					/>
					<Input
						error={errors.pairsCosted}
						htmlFor={"pairsCosted"}
						label={t("pairsCosted")}
						name="pairsCosted"
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
		</div>
	);
};
