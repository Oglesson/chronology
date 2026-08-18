import { Select as BaseSelect } from "@base-ui/react";
import {
	FocusEvent,
	KeyboardEvent,
	MouseEvent,
	ReactNode,
	useState,
} from "react";
import {
	Control,
	Controller,
	FieldError,
	FieldValues,
	Path,
	PathValue,
} from "react-hook-form";
import Icons from "../config.common/Icons";
import { RenderIcon } from "../utilities.common/RenderIcon";
import { FormError } from "./FormError";
import { Label } from "./Label";
import { Tooltip } from "../components/common/tooltip/Tooltip";
import { DefaultTReturn } from "i18next";

export type SelectOption = {
	label?: string | ReactNode;
	value: string | number | boolean | undefined | null;
};

type SelectProps<T extends FieldValues> = {
	control: Control<T>;
	defaultValue?: PathValue<T, Path<T>>;
	error?: FieldError;
	htmlFor: string;
	label?: string | DefaultTReturn;
	maxHeight?: number;
	name: Path<T>;
	onChange?: (
		event: MouseEvent | KeyboardEvent | FocusEvent | null,
		value: string | number | boolean | undefined | null,
	) => boolean | void;
	options: SelectOption[];
	placeholder?: string;
	tooltipContent?: ReactNode;
	horizontal?: boolean;
	disabled?: boolean;
	className?: string;
};

export const Select = <T extends FieldValues>({
	control,
	defaultValue,
	error,
	htmlFor,
	label,
	maxHeight,
	name,
	options,
	onChange,
	placeholder,
	tooltipContent,
	horizontal,
	disabled,
	className,
	...props
}: SelectProps<T>) => {
	const [isOpen, setIsOpen] = useState(false);

	if (!options?.length && !placeholder?.length) {
		return <></>;
	}

	return (
		<div
			className={`form-field${disabled ? " form-field--disabled" : ""}${
				horizontal ? " flex flex-wrap gap-x-6 items-center" : ""
			}${className ? " " + className : ""}`}
			{...props}
		>
			<div className="form-field__label flex justify-between">
				{label && (
					<Label
						htmlFor={htmlFor}
						label={label}
						theme={horizontal ? "horizontal" : null}
					/>
				)}

				{tooltipContent && (
					<div className="ml-3">
						<Tooltip content={tooltipContent}>
							<RenderIcon icon={Icons.Interface.Info} />
						</Tooltip>
					</div>
				)}
			</div>
			<Controller
				render={({ field }) => {
					const fieldValue =
						JSON.stringify(field.value) === "{}"
							? null
							: field.value;
					const resolvedValue = fieldValue ?? defaultValue ?? null;
					const isPlaceholder =
						(defaultValue === undefined || defaultValue === "") &&
						(field.value === undefined || field.value === "");
					const selectedOption = options.find(
						(o) => o.value === resolvedValue,
					);

					return (
						<BaseSelect.Root
							value={resolvedValue === "" ? null : resolvedValue}
							onValueChange={(value, event) => {
								if (onChange?.(event as MouseEvent | KeyboardEvent | FocusEvent | null, value) === false) {
									return;
								}
								field.onChange(value);
							}}
							onOpenChange={(open) => setIsOpen(open)}
							disabled={!options?.length || disabled}
						>
							<BaseSelect.Trigger
								id={htmlFor}
								className={`form-input${
									error ? " form-input--error" : ""
								} select${
									isPlaceholder ? " select--placeholder" : ""
								}`}
							>
								<span className="select__inner">
									<span className="select__text">
										{selectedOption?.label ?? placeholder}
									</span>
									<RenderIcon
										icon={
											Icons.Interface[
												isOpen
													? "ArrowUpSmall"
													: "ArrowDownSmall"
											]
										}
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
											maxHeight: maxHeight ?? 300,
											overflow: "auto",
										}}
									>
										{options?.map((option) => (
											<BaseSelect.Item
												key={`${option.value}`}
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
				defaultValue={defaultValue}
				name={name}
				control={control}
			/>
			<FormError error={error} horizontal={horizontal} />
		</div>
	);
};
