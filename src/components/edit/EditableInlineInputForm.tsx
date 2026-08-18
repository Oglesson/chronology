import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ZodObject, ZodRawShape } from "zod";
import { Tooltip } from "../common/tooltip/Tooltip";
import Icons from "../../config.common/Icons";
import { FORM_IDENTIFIERS } from "../../constants.common/formIdentifiers";
import { useFetcher } from "../../hooks.common/useFetcher";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import ResponseDataUtilities from "../../utilities.common/ResponseDataUtilities";
import { toCamelCase } from "../../utilities.common/StringUtilities";
import { EditableInlineContext } from "./EditableInlineContext";

interface EditProps {
	action?: string;
	defaultValues: { [key: string]: string | number };
	formId: string;
	identifier?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	inputId: any;
	onReset?: () => void;
	schema: ZodObject<ZodRawShape>;
	visible: boolean;
}

export const EditableInlineInputForm = ({
	action,
	defaultValues,
	formId,
	identifier,
	inputId,
	onReset,
	schema,
	visible,
	...props
}: EditProps) => {
	const { t } = useTranslation();

	const { setControl } = useContext(EditableInlineContext);

	const {
		control,
		handleSubmit,
		reset,
		getValues,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: defaultValues,
		resolver: zodResolver(schema),
	});

	const onSubmit = (data: unknown) => console.log(data);
	const onSubmitError = (data: unknown) => console.error(data);
	const { fetcher, isFetching, responseData } = useFetcher();

	useEffect(() => {
		if (responseData?.type === "success") {
			ResponseDataUtilities.resetResponseData(responseData);
			reset(getValues());
			onReset?.();
		}
	}, [responseData?.type]);

	useEffect(() => {
		setControl?.(control);
	}, [setControl]);

	const errorValues =
		responseData?.type === "error" && responseData.responseMessage?.Reason
			? `${t(
					toCamelCase(responseData.responseMessage.Reason),
					responseData.responseMessage.Reason
				).replace("%s", responseData.responseMessage.Detail ?? "")}`
			: Object.values(errors)
					.map((value) => value?.message)
					.filter(Boolean)
					.join(", ");

	return (
		<fetcher.Form
			className={visible ? "" : "hidden"}
			id={formId}
			method="put"
			action={action ?? ""}
			onSubmit={(e) => {
				if (!isValid) {
					handleSubmit(onSubmit, onSubmitError)(e);
				}
			}}
			{...props}
		>
			<>
				<input type="hidden" name="id" value={inputId} />
				{identifier && (
					<input
						type="hidden"
						name={FORM_IDENTIFIERS.nameAttribute}
						value={identifier}
					/>
				)}

				<div className="inline-flex">
					{isFetching || errorValues.length === 0 ? (
						<div
							className={`editable__loading ${
								isFetching ? "" : "invisible"
							}`}
						>
							<RenderIcon icon={Icons.Interface.Loading} />
						</div>
					) : (
						<Tooltip
							content={errorValues.length ? errorValues : ""}
							open={true}
							placement="top"
							theme="error"
						>
							<div className="editable__tooltip text-decline">
								<RenderIcon icon={Icons.Interface.Info} />
							</div>
						</Tooltip>
					)}
					<button
						className="editable__accept"
						type="submit"
						disabled={isFetching}
					>
						<RenderIcon icon={Icons.Interface.Tick} />
						<span className="sr-only">{t("edit")}</span>
					</button>
					<button
						className="editable__cancel"
						type="button"
						onClick={() => {
							reset();
							onReset?.();
						}}
						disabled={isFetching}
					>
						<RenderIcon icon={Icons.Interface.Close} />
						<span className="sr-only">{t("cancel")}</span>
					</button>
				</div>
			</>
		</fetcher.Form>
	);
};
