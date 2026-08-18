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

/* there is every chance I will replace this with a custom UI at some point 
but will use the HTML for now and style it as best as I can */

type DateInputProps<T extends FieldValues> =
	InputHTMLAttributes<HTMLInputElement> & {
		defaultValue?: string | Date;
		error?: FieldError;
		htmlFor: string;
		label: string;
		name: Path<T>;
		onBlur?: (e: FocusEvent<HTMLInputElement, Step>) => void;
		placeholder?: string;
		register: UseFormRegister<T>;
		tooltipContent?: ReactNode;
		type?: HTMLInputTypeAttribute;
	};

export const DateInput = <T extends FieldValues>({
	defaultValue,
	htmlFor,
	label,
	name,
	placeholder,
	register,
	error,
	tooltipContent,
	...props
}: DateInputProps<T>) => {
	const attributes: { step?: string } = {};

	return (
		<div
			className={`form-field, form-field--date${
				props.disabled ? " form-field--disabled" : ""
			}`}
		>
			<div className="form-field__label flex justify-between">
				<Label htmlFor={htmlFor} label={label} />
				{tooltipContent && (
					<div className="ml-3">
						<Tooltip content={tooltipContent}>
							<RenderIcon icon={Icons.Interface.Info} />
						</Tooltip>
					</div>
				)}
			</div>
			<input
				{...register(name)}
				id={htmlFor}
				className={`form-input form-input--date${
					error ? " form-input--error" : ""
				}`}
				placeholder={placeholder}
				type={"date"}
				{...attributes}
				aria-invalid={error ? "true" : "false"}
				defaultValue={defaultValue}
				{...props}
			/>
			<FormError error={error} />
		</div>
	);
};
