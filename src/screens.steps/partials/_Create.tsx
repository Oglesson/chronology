import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "../../components/common/button/Button";
import { Modal } from "../../components/modal/Modal";
import Icons from "../../config.common/Icons";
import { CheckableList } from "../../forms.common/CheckableList";
import { Input } from "../../forms.common/Input";
import { useFetcher } from "../../hooks.common/useFetcher";
import { useStepFormSchema } from "../../hooks.schema/forms";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import { ModalContext } from "./_ModalContext";
import { useSteps } from "../../hooks.queries/useSteps";
import { NotificationContext } from "../../context.common/NotificationContext";
import ResponseDataUtilities from "../../utilities.common/ResponseDataUtilities";

export const Create = () => {
	const { openModal, setOpenModal } = useContext(ModalContext);
	const { stepCodes } = useSteps();
	const { processResponse } = useContext(NotificationContext);
	const { t } = useTranslation();
	const stepFormSchema = useStepFormSchema(stepCodes);
	type StepFormData = z.infer<typeof stepFormSchema>;

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(stepFormSchema),
	});
	const onSubmit = (data: StepFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	const { fetcher, isFetching, responseData } = useFetcher();

	useEffect(() => {
		if (responseData?.type === "error") {
			processResponse(responseData);
			ResponseDataUtilities.resetResponseData(responseData);
		}
	}, [responseData?.type, responseData, processResponse]);

	return (
		<>
			<Button text={t("createAnStep")} onClick={setOpenModal} />
			<Modal isOpen={openModal}>
				<h2 className="typo-h3 mb-12">{t("createAnStep")}</h2>
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
						tooltipContent={t("tooltipStepCode")}
					/>
					<Input
						error={errors.description}
						htmlFor={"description"}
						label={t("description")}
						name="description"
						register={register}
						tooltipContent={t("tooltipStepDescription")}
					/>
					<CheckableList
						error={errors.valueAdded}
						label={`${t("valueAdded")}?`}
						items={[
							{
								htmlFor: "yes",
								label: t("yes"),
								name: "valueAdded",
								value: "yes",
							},
							{
								htmlFor: "no",
								label: t("no"),
								name: "valueAdded",
								value: "no",
							},
						]}
						register={register}
						type="radio"
						tooltipContent={t("tooltipStepValueAdded")}
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

export const CreatePlus = ({ ...props }) => {
	const { setOpenModal } = useContext(ModalContext);
	const { t } = useTranslation();

	return (
		<div {...props}>
			<button
				type="button"
				className="interaction:bg-white button button--primary button--circle"
				onClick={setOpenModal}
			>
				<span className="sr-only">{t("create")}</span>
				<RenderIcon icon={Icons.Edit.PlusSmall} sizes="w-3.5 h-3.5" />
			</button>
		</div>
	);
};
