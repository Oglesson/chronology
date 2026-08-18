import { zodResolver } from "@hookform/resolvers/zod";
import { Select as BaseSelect } from "@base-ui/react";
import {
	cloneElement,
	Key,
	KeyboardEvent,
	ReactElement,
	ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	Controller,
	FieldValues,
	Path,
	SubmitErrorHandler,
	SubmitHandler,
	useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Tooltip } from "../common/tooltip/Tooltip";
import Icons from "../../config.common/Icons";
import { FORM_IDENTIFIERS } from "../../constants.common/formIdentifiers";
import { SelectOption } from "../../forms.common/Select";
import { useFetcher } from "../../hooks.common/useFetcher";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import ResponseDataUtilities from "../../utilities.common/ResponseDataUtilities";
import { toCamelCase } from "../../utilities.common/StringUtilities";
import { EditableGroupContext } from "./EditableGroup";
import "./editableInputs.scss";
import { EditableSectionContext } from "./EditableSection";
import classNames from "classnames";

export type EditableInputProps<T extends FieldValues> = {
	action?: string;
	defaultActive?: boolean;
	defaultElement: ReactElement;
	defaultValue?: string | number | SelectOption[];
	disableEdit?: boolean;
	identifier?: string;
	inputId?: number;
	inputName?: Path<T>;
	inputType?: "text" | "number" | "radio" | "select" | "textarea";
	onReset?: () => void;
	placeholder?: string | null;
	schema?: z.Schema<T>;
	selectedValue?: string | number;
	alignHorizontal?: "left" | "right" | "center";
};

export const EditableInput = <T extends FieldValues>({
	action,
	alignHorizontal,
	defaultActive = false,
	defaultElement,
	defaultValue,
	disableEdit,
	identifier,
	inputId,
	inputName,
	inputType,
	onReset,
	placeholder,
	schema,
	selectedValue,
	...props
}: EditableInputProps<T>) => {
	const { fetcher, isFetching, responseData } = useFetcher();
	const [isActive, setIsActive] = useState<boolean>(false);
	const [prevDefaultActive, setPrevDefaultActive] = useState(defaultActive);
	const { t } = useTranslation();
	const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
	const editableSectionContext = useContext(EditableSectionContext);
	const editableGroupContext = useContext(EditableGroupContext);
	const elementProps = defaultElement.props as {
		className?: string;
		children?: ReactNode;
	};
	const clonedEleStyles = classNames(
		`editable__text`,
		elementProps.className && ` ${elementProps.className}`,
		alignHorizontal && `!text-${alignHorizontal}`,
	);
	const clonedElement = cloneElement(defaultElement, {
		className: clonedEleStyles,
		children:
			inputType === "select" ? (
				<span className="select__inner">
					<span className="select__text">
						{elementProps.children || placeholder}
					</span>
					<RenderIcon
						icon={Icons.Interface.ArrowDownSmall}
						classes="select__icon invisible group-hover:visible"
						sizes=""
					/>
				</span>
			) : (
				elementProps.children || placeholder
			),
	});
	const onSubmit: SubmitHandler<T> = (data) => console.log(data);
	const onSubmitError: SubmitErrorHandler<T> = (data) => console.error(data);
	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<T>({
		resolver: schema ? zodResolver(schema) : undefined,
	});

	const { ref, ...registerInput } = inputName
		? register(inputName, {
				valueAsNumber: inputType === "number",
			})
		: {
				ref: undefined,
			};

	const setHeight = () => {
		if (inputRef.current) {
			inputRef.current.style.minHeight = "";
			inputRef.current.style.minHeight = `${inputRef.current.scrollHeight}px`;
		}
	};

	const errorValues = Object.values(errors);

	useEffect(() => {
		if (isActive) {
			if (responseData?.type === "success") {
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setIsActive(false);
				onReset?.();
				ResponseDataUtilities.resetResponseData(responseData);
			}
		}
		editableSectionContext?.setInputName(isActive ? inputName : undefined);
		editableGroupContext?.setIsActive(isActive);
	}, [isActive, responseData?.type]);

	useEffect(() => {
		if (isActive && inputRef.current) {
			inputRef.current.focus();
			if (inputRef.current instanceof HTMLTextAreaElement) {
				inputRef.current.selectionStart = inputRef.current.value.length;
				const resizeObserver = new ResizeObserver(setHeight);
				resizeObserver.observe(inputRef.current);
				return () => {
					if (inputRef.current) {
						resizeObserver.unobserve(inputRef.current);
					}
				};
			}
		}
	}, [isActive]);

	if (prevDefaultActive !== defaultActive) {
		setPrevDefaultActive(defaultActive);
		setIsActive(defaultActive);
	}

	useEffect(() => {
		reset();
	}, [defaultActive]);

	if (
		disableEdit ||
		(editableSectionContext?.inputName &&
			editableSectionContext.inputName !== inputName)
	) {
		return clonedElement;
	}

	const handleClose = () => {
		setIsActive(false);
		onReset?.();
		ResponseDataUtilities.resetResponseData(responseData);
		reset();
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.code === "Escape") {
			handleClose();
		}

		return;
	};

	const renderInput = () => {
		const isSelectOptionArray = typeof defaultValue === "object";
		const hasSingleDefaultValue = defaultValue && !isSelectOptionArray;

		switch (inputType) {
			case "number":
				return (
					<input
						className={classNames(
							`editable__input`,
							alignHorizontal && `!text-${alignHorizontal}`,
						)}
						defaultValue={
							hasSingleDefaultValue
								? defaultValue
								: defaultElement?.props.children
						}
						onKeyDown={handleKeyDown}
						type="number"
						step="any"
						ref={(e: HTMLInputElement) => {
							ref?.(e);
							inputRef.current = e;
						}}
						{...registerInput}
					/>
				);
			case "select":
				if (!defaultValue || !isSelectOptionArray) {
					return <></>;
				}

				return (
					<Controller
						control={control}
						name={inputName as Path<T>}
						render={({
							field: { onBlur, onChange, name, ref, value },
							fieldState: { isDirty },
						}) => {
							const resolvedValue = isDirty ? value : selectedValue;
							const selectedOption = defaultValue.find(
								(o) => o.value === resolvedValue,
							);

							return (
								<BaseSelect.Root
									key={selectedValue}
									defaultValue={selectedValue}
									name={name}
									defaultOpen={true}
									value={resolvedValue}
									onValueChange={(val) => onChange(val)}
								>
									<BaseSelect.Trigger
										className="editable__select"
										onKeyDown={handleKeyDown}
										onBlur={onBlur}
										ref={ref}
									>
										<span className="select__inner">
											<span className="select__text">
												{selectedOption?.label}
											</span>
											<RenderIcon
												icon={Icons.Interface.ArrowDownSmall}
												classes="select__icon"
												sizes=""
											/>
										</span>
									</BaseSelect.Trigger>
									<BaseSelect.Portal>
										<BaseSelect.Positioner
											side="bottom"
											sideOffset={0}
											alignItemWithTrigger={false}
											className="select__popper"
										>
											<BaseSelect.Popup
												className="select__listbox"
												style={{
													maxHeight: 300,
													overflow: "auto",
												}}
											>
												{defaultValue.map((option) => (
													<BaseSelect.Item
														key={option.value as Key}
														value={option.value}
														className="option"
													>
														{option.label ?? option.value}
													</BaseSelect.Item>
												))}
											</BaseSelect.Popup>
										</BaseSelect.Positioner>
									</BaseSelect.Portal>
								</BaseSelect.Root>
							);
						}}
					/>
				);

			case "textarea":
				return (
					<textarea
						className={classNames(
							`editable__input`,
							`editable__textarea`,
							alignHorizontal && `!text-${alignHorizontal}`,
						)}
						defaultValue={
							hasSingleDefaultValue
								? defaultValue
								: defaultElement?.props.children
						}
						onInput={setHeight}
						onKeyDown={handleKeyDown}
						ref={(e: HTMLTextAreaElement) => {
							ref?.(e);
							inputRef.current = e;
						}}
						{...registerInput}
					></textarea>
				);

			case "text":
			default:
				return (
					<input
						className={classNames(
							`editable__input`,
							alignHorizontal && `!text-${alignHorizontal}`,
						)}
						defaultValue={
							hasSingleDefaultValue
								? defaultValue
								: defaultElement?.props.children
						}
						onKeyDown={handleKeyDown}
						type="text"
						ref={(e: HTMLInputElement) => {
							ref?.(e);
							inputRef.current = e;
						}}
						{...registerInput}
					/>
				);
		}
	};

	return (
		<fetcher.Form
			method="put"
			action={action ?? ""}
			className={`editable editable--${isActive ? "active" : "inactive"}`}
			onSubmit={(e) => {
				if (!isValid) {
					handleSubmit(onSubmit, onSubmitError)(e);
				}
			}}
			{...props}
		>
			{inputId && <input type="hidden" name="id" value={inputId} />}
			{identifier && (
				<input
					type="hidden"
					name={FORM_IDENTIFIERS.nameAttribute}
					value={identifier}
				/>
			)}
			<fieldset
				disabled={isFetching}
				className={`editable__fieldset ${
					elementProps.className
						? defaultElement.props.className
						: ""
				} group`}
			>
				{isActive ? (
					<>
						{renderInput()}
						<div className="editable__approval">
							{isFetching ||
							(responseData?.type !== "error" &&
								Object.values(errors).length === 0) ? (
								<div
									className={`editable__loading ${
										isFetching ? "" : "invisible"
									}`}
								>
									<RenderIcon
										icon={Icons.Interface.Loading}
									/>
								</div>
							) : (
								<Tooltip
									content={
										errorValues.length
											? errorValues
													.map(
														(value) =>
															value?.message,
													)
													.join(", ")
											: responseData.responseMessage
														?.Reason
												? `${t(
														toCamelCase(
															responseData
																.responseMessage
																.Reason,
														),
														responseData
															.responseMessage
															.Reason,
													).replace(
														"%s",
														responseData
															.responseMessage
															.Detail ?? "",
													)}`
												: ""
									}
									open={true}
									placement="left"
									theme="error"
								>
									<div className="editable__tooltip text-decline">
										<RenderIcon
											icon={Icons.Interface.Info}
										/>
									</div>
								</Tooltip>
							)}
							<button
								type="submit"
								className="editable__accept disabled:opacity-30 disabled:pointer-events-none"
								disabled={isFetching}
							>
								<RenderIcon icon={Icons.Interface.Tick} />
								<span className="sr-only">{t("edit")}</span>
							</button>
							<button
								type="button"
								onClick={handleClose}
								className="editable__cancel disabled:opacity-30 disabled:pointer-events-none"
								disabled={isFetching}
							>
								<RenderIcon icon={Icons.Interface.Close} />
								<span className="sr-only">{t("cancel")}</span>
							</button>
						</div>
					</>
				) : (
					<>
						<button
							type="button"
							className="editable__button"
							onClick={() => {
								setIsActive(true);
							}}
						>
							<span className="sr-only">{t("edit")}</span>
						</button>
						{clonedElement}
					</>
				)}
			</fieldset>
		</fetcher.Form>
	);
};
