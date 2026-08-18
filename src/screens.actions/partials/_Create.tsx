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
import { useActionFormSchema } from "../../hooks.schema/forms";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import { ActionsContext } from "./_ActionsContext";
import { useActions } from "../../hooks.queries/useActions";
import ResponseDataUtilities from "../../utilities.common/ResponseDataUtilities";
import { NotificationContext } from "../../context.common/NotificationContext";

export const Create = () => {
	const { actionCodes } = useActions();
	const { openModal, setOpenModal } = useContext(ActionsContext);
	const { processResponse } = useContext(NotificationContext);
	const { t } = useTranslation();
	const actionFormSchema = useActionFormSchema(actionCodes);
	type ActionFormData = z.infer<typeof actionFormSchema>;

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(actionFormSchema),
	});
	const onSubmit = (data: ActionFormData) => console.log(data);
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
			<Button text={t("createAction")} onClick={setOpenModal} />
			<Modal isOpen={openModal}>
				<h2 className="typo-h3 mb-12">{t("createAAction")}</h2>
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
						tooltipContent={t("tooltipActionCode")}
					/>
					<Input
						error={errors.description}
						htmlFor={"description"}
						label={t("description")}
						name="description"
						register={register}
						tooltipContent={t("tooltipActionDescription")}
					/>
					<Input
						error={errors.secsAt100}
						htmlFor={"secsAt100"}
						label={t("secondsAt100Performance")}
						name="secsAt100"
						register={register}
						type="number"
						tooltipContent={t("tooltipActionSeconds")}
					/>
					<CheckableList
						error={errors.reflectLevel}
						label={t("reflectLevel")}
						items={[
							{
								htmlFor: "yes",
								label: t("yes"),
								name: "reflectLevel",
								value: "yes",
							},
							{
								htmlFor: "no",
								label: t("no"),
								name: "reflectLevel",
								value: "no",
							},
						]}
						register={register}
						type="radio"
						tooltipContent={t("tooltipActionReflectLevel")}
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
							text={t("createAction")}
							type="submit"
						/>
					</div>
				</fetcher.Form>
			</Modal>
		</>
	);
};

export const CreatePlus = ({ ...props }) => {
	const { setOpenModal } = useContext(ActionsContext);
	const { t } = useTranslation();

	return (
		<div {...props}>
			<button
				type="button"
				className="interaction:bg-white button button--primary button--circle"
				onClick={setOpenModal}
			>
				<span className="sr-only">{t("createAction")}</span>
				<RenderIcon icon={Icons.Edit.PlusSmall} sizes="w-3.5 h-3.5" />
			</button>
		</div>
	);
};
