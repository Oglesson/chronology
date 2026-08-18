import { Popper, useAutocomplete } from "@mui/base";
import { ModifierArguments, State } from "@popperjs/core";
import { InputHTMLAttributes, RefObject, useEffect } from "react";
import {
	Control,
	FieldError,
	FieldValues,
	Path,
	useController,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormError } from "./FormError";
import { Label } from "./Label";

type UnknownObj = {
	[key: string]: unknown;
};

type AutoCompleteProps<T extends FieldValues> = {
	control: Control<T>;
	defaultValue?: unknown;
	error?: FieldError;
	htmlFor: string;
	label: string;
	maxHeight?: number;
	name: Path<T>;
	options: UnknownObj[];
	optionLabelKeys: string | string[];
};

export const AutoComplete = <T extends FieldValues>({
	control,
	defaultValue,
	error,
	htmlFor,
	label,
	maxHeight,
	name,
	options,
	optionLabelKeys,
	...props
}: AutoCompleteProps<T>) => {
	const { t } = useTranslation();

	const {
		field: { onBlur, onChange, ref, value },
	} = useController({
		name,
		control,
	});

	useEffect(() => {
		onChange(JSON.stringify(defaultValue));
	}, []);

	const makeSearchOptionsString = (dataItem: UnknownObj) => {
		let result = "";
		if (Array.isArray(optionLabelKeys)) {
			optionLabelKeys.forEach(
				(searchKey) => (result = `${result} ${dataItem[searchKey]}`),
			);
		}
		return result;
	};

	const {
		getRootProps,
		getInputLabelProps,
		getInputProps,
		getListboxProps,
		getOptionProps,
		groupedOptions,
		popupOpen,
	} = useAutocomplete({
		defaultValue: defaultValue,
		autoComplete: true,
		autoHighlight: true,
		filterOptions: Array.isArray(optionLabelKeys)
			? (data, value) => {
					return data.filter((x) =>
						makeSearchOptionsString(x)
							.toLowerCase()
							.includes(value.inputValue.toLowerCase()),
					);
				}
			: (data, value) => {
					return data.filter((x) =>
						(x[optionLabelKeys] as string)
							?.toLowerCase()
							.startsWith(value.inputValue.toLowerCase()),
					);
				},
		getOptionLabel: Array.isArray(optionLabelKeys)
			? (option) => makeSearchOptionsString(option)
			: (option) => option[optionLabelKeys],
		id: `${htmlFor}`,
		isOptionEqualToValue: Array.isArray(optionLabelKeys)
			? (option, value) =>
					makeSearchOptionsString(option) ===
					makeSearchOptionsString(value)
			: (option, value) =>
					option[optionLabelKeys] === value[optionLabelKeys],
		onChange: (_event, value) => {
			onChange(value ? JSON.stringify(value) : "");
		},
		openOnFocus: true,
		options: options.sort(function (a, b) {
			if (Array.isArray(optionLabelKeys)) {
				return a[optionLabelKeys[0]]?.localeCompare(
					b[optionLabelKeys[0]],
				);
			} else {
				return a[optionLabelKeys]?.localeCompare(b[optionLabelKeys]);
			}
		}),
	});

	const inputProps =
		getInputProps() as InputHTMLAttributes<HTMLInputElement> & {
			ref: RefObject<HTMLInputElement>;
		};

	if (!options.length) {
		return <></>;
	}

	return (
		<div className="form-field" {...props} {...getRootProps()}>
			<Label label={label} {...getInputLabelProps()} />
			<input
				{...inputProps}
				aria-invalid={error ? "true" : "false"}
				className={`form-input${error ? " form-input--error" : ""}`}
				type="text"
				onBlur={(event) => {
					onBlur();
					inputProps.onBlur?.(event);
				}}
			/>
			<input
				className="sr-only"
				name={name}
				onFocus={() => {
					inputProps.ref?.current?.focus();
				}}
				readOnly
				ref={ref}
				tabIndex={-1}
				type="text"
				defaultValue={value}
			/>
			<Popper
				open={popupOpen}
				anchorEl={inputProps.ref?.current}
				disablePortal={true}
				popperOptions={{
					placement: "bottom",
					modifiers: [
						{
							name: "dimensions",
							enabled: true,
							fn: ({ state }: ModifierArguments<State>) => {
								state.styles.popper.width = `${state.rects.reference.width}px`;
								state.styles.popper.maxHeight = `${Math.floor(
									Math.min(
										Math.max(
											84,
											window.innerHeight -
												(state.rects.reference.y +
													state.rects.reference
														.height +
													20),
										),
										maxHeight ?? 300,
									),
								)}px`;
							},
							phase: "beforeWrite",
							requires: ["computeStyles"],
						},
					],
					strategy: "fixed",
				}}
				slotProps={{
					root: {
						className: "select__popper",
					},
				}}
			>
				<ul className="select__listbox" {...getListboxProps()}>
					{groupedOptions.length > 0 ? (
						(groupedOptions as typeof options).map(
							(option, index) => {
								const optionProps = getOptionProps({
									option,
									index,
								});
								return (
									<li
										className="MuiOption option"
										{...optionProps}
									>
										{Array.isArray(optionLabelKeys)
											? makeSearchOptionsString(option)
											: option[optionLabelKeys]}
									</li>
								);
							},
						)
					) : (
						<li className="MuiOption option">
							{t("noOptions", {
								defaultValue: "No options",
							})}
						</li>
					)}
				</ul>
			</Popper>
			<FormError error={error} />
		</div>
	);
};
