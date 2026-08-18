import {
	FocusEvent,
	HTMLInputTypeAttribute,
	ReactNode,
	InputHTMLAttributes,
} from "react";
import {
	FieldError,
	FieldValues,
	Path,
	UseFormRegister,
} from "react-hook-form";
import { FormError } from "./FormError";
import { Label } from "./Label";
import { Tooltip } from "../components/common/tooltip/Tooltip";
import { RenderIcon } from "../utilities.common/RenderIcon";
import Icons from "../config.common/Icons";
import { DefaultTFuncReturn } from "i18next";

type InputProps<T extends FieldValues> =
	InputHTMLAttributes<HTMLInputElement> & {
		defaultValue?: string | number;
		error?: FieldError;
		htmlFor: string;
		label?: string | DefaultTFuncReturn;
		name: Path<T>;
		onBlur?: (e: FocusEvent<HTMLInputElement, Step>) => void;
		placeholder?: string;
		register: UseFormRegister<T>;
		tooltipContent?: ReactNode;
		type?: HTMLInputTypeAttribute;
		horizontal?: boolean;
	};

export const Input = <T extends FieldValues>({
	defaultValue,
	htmlFor,
	label,
	name,
	placeholder,
	register,
	error,
	tooltipContent,
	type,
	horizontal,
	onChange,
	...props
}: InputProps<T>) => {
	const attributes: { step?: string } = {};

	if (type === "number") {
		attributes.step = "any";
	}

	return (
		<div
			className={`form-field${
				props.disabled ? " form-field--disabled" : ""
			}${horizontal ? " flex flex-wrap gap-x-6 items-center" : ""}`}
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
			<input
				{...register(name, {
					valueAsNumber: type === "number",
					onChange: (e) => {
						if (onChange) onChange(e);
					},
				})}
				id={htmlFor}
				className={`form-input${error ? " form-input--error" : ""}`}
				placeholder={placeholder}
				type={type ?? "text"}
				{...attributes}
				aria-invalid={error ? "true" : "false"}
				defaultValue={defaultValue}
				{...props}
			/>
			<FormError error={error} />
		</div>
	);
};
