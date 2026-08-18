import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "../../../components/common/button/Button";
import Icons from "../../../config.common/Icons";
import { Input } from "../../../forms.common/Input";
import { Select } from "../../../forms.common/Select";
import { useFetcher } from "../../../hooks.common/useFetcher";
import { useDepartments } from "../../../hooks.queries/useDepartments";
import { useProcessSetFormSchema } from "../../../hooks.schema/forms";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import { useProcessSets } from "../../../hooks.queries/useProcessSets";
import ResponseDataUtilities from "../../../utilities.common/ResponseDataUtilities";
import { NotificationContext } from "../../../context.common/NotificationContext";
import { DesignsContext } from "../../designs.index/partials/_DesignsContext";

export const Create = () => {
	const { setOpenModalContent } = useContext(DesignsContext);
	const { processSetCodes } = useProcessSets();
	const processSetFormSchema = useProcessSetFormSchema(processSetCodes);
	const { departmentOptions } = useDepartments();
	type ProcessSetFormData = z.infer<typeof processSetFormSchema>;
	const { processResponse } = useContext(NotificationContext);

	const { t } = useTranslation();
	const {
		control,
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(processSetFormSchema),
	});
	const onSubmit = (data: ProcessSetFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	const { fetcher, isFetching, responseData } = useFetcher();

	useEffect(() => {
		if (responseData?.type === "error") {
			processResponse(responseData);
			ResponseDataUtilities.resetResponseData(responseData);
		}
	}, [responseData, processResponse]);

	return (
		<>
			<h2 className="typo-h3 mb-12">
				{t("createAnOperationSet", {
					defaultValue: "Create an Process Set",
				})}
			</h2>
			<fetcher.Form
				method="post"
				action="/designs/process-sets"
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
				/>
				<Input
					error={errors.description}
					htmlFor={"description"}
					label={t("description")}
					name="description"
					placeholder="Enter a description..."
					register={register}
				/>
				<Select
					control={control}
					name="department"
					error={errors.department}
					htmlFor="department"
					label={t("department")}
					options={departmentOptions}
					placeholder="Select a department..."
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
