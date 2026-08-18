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
import { useFetcher } from "../../hooks.common/useFetcher";
import { useNameFieldSchema } from "../../hooks.schema/fields";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import ResponseDataUtilities from "../../utilities.common/ResponseDataUtilities";
import { ProcessTypeContext } from "./_ProcessTypeContext";

export const CreateClass = () => {
	const nameFieldSchema = useNameFieldSchema(20);
	type GroupFormData = z.infer<typeof nameFieldSchema>;
	const { openCreateClassModal, setOpenCreateClassModal } =
		useContext(ProcessTypeContext);
	const { processResponse } = useContext(NotificationContext);
	const { t } = useTranslation();
	const {
		handleSubmit,
		register,
		reset,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(nameFieldSchema),
	});
	const onSubmit = (data: GroupFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	const { fetcher, isFetching, responseData } = useFetcher();

	useEffect(() => {
		if (openCreateClassModal) {
			reset();
		}
	}, [openCreateClassModal, reset]);

	useEffect(() => {
		if (responseData?.type === "success") {
			ResponseDataUtilities.resetResponseData(responseData);
			setOpenCreateClassModal();
		} else if (responseData?.type === "error") {
			processResponse(responseData);
			ResponseDataUtilities.resetResponseData(responseData);
		}
	}, [responseData?.type, responseData, processResponse, setOpenCreateClassModal]);

	return (
		<>
			<Button
				text={t("createAProcessClass")}
				icon={Icons.Edit.PlusSmall}
				style="tertiary"
				onClick={setOpenCreateClassModal}
				className="mt-6"
			/>
			<Modal isOpen={openCreateClassModal}>
				<h2 className="typo-h3 mb-12">{t("createAProcessClass")}</h2>
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
						value={FORM_IDENTIFIERS.createProcessClass}
					/>
					<Input
						error={errors.name}
						htmlFor={"name"}
						label={t("name")}
						name="name"
						placeholder={`${t("enterAName")}...`}
						register={register}
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
							onClick={setOpenCreateClassModal}
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
