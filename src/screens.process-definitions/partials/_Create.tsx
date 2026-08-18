import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "../../components/common/button/Button";
import { Modal } from "../../components/modal/Modal";
import Icons from "../../config.common/Icons";
import { NotificationContext } from "../../context.common/NotificationContext";
import { CheckableList } from "../../forms.common/CheckableList";
import { Input } from "../../forms.common/Input";
import { useFetcher } from "../../hooks.common/useFetcher";
import { useProcessDefinitions } from "../../hooks.queries/useProcessDefinitions";
import { useProcessDefinitionFormSchema } from "../../hooks.schema/forms";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import ResponseDataUtilities from "../../utilities.common/ResponseDataUtilities";
import { ProcessDefinitionContext } from "./_ProcessDefinitionContext";

export const Create = () => {
	const { processDefinitionCodes } = useProcessDefinitions();
	const processDefinitionFormSchema = useProcessDefinitionFormSchema(
		processDefinitionCodes
	);
	type ProcessDefinitionFormData = z.infer<
		typeof processDefinitionFormSchema
	>;

	const {
		openCreateProcessDefinitionModal,
		setOpenCreateProcessDefinitionModal,
	} = useContext(ProcessDefinitionContext);
	const { processResponse } = useContext(NotificationContext);
	const { t } = useTranslation();
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(processDefinitionFormSchema),
	});
	const onSubmit = (data: ProcessDefinitionFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	const { fetcher, isFetching, responseData } = useFetcher();

	useEffect(() => {
		if (responseData?.type === "error") {
			processResponse(responseData);
			ResponseDataUtilities.resetResponseData(responseData);
		}
	}, [responseData?.type, responseData, processResponse]);

	useEffect(() => {
		if (openCreateProcessDefinitionModal) {
			reset();
		}
	}, [openCreateProcessDefinitionModal, reset]);

	return (
		<>
			<button
				type="button"
				className="interaction:bg-white button button--primary button--circle"
				onClick={setOpenCreateProcessDefinitionModal}
			>
				<span className="sr-only">{t("create")}</span>
				<RenderIcon icon={Icons.Edit.PlusSmall} sizes="w-3.5 h-3.5" />
			</button>
			<Modal isOpen={openCreateProcessDefinitionModal}>
				<h2 className="typo-h3 mb-12">{t("createADefinition")}</h2>
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
						error={errors.code}
						htmlFor={"code"}
						label={t("code")}
						name="code"
						register={register}
					/>
					<CheckableList
						error={errors.type}
						label={t("type")}
						items={[
							{
								htmlFor: "handling",
								label: "Handling",
								name: "type",
								value: "handling",
							},
							{
								htmlFor: "task",
								label: "Task",
								name: "type",
								value: "task",
							},
						]}
						register={register}
						type="radio"
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
							onClick={setOpenCreateProcessDefinitionModal}
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
