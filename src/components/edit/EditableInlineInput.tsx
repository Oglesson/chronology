import { Option, Select } from "@mui/base";
import {
	cloneElement,
	Key,
	KeyboardEvent,
	ReactElement,
	ReactNode,
	useContext,
} from "react";
import { Control, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useFetchers } from "react-router-dom";
import Icons from "../../config.common/Icons";
import { SelectOption } from "../../forms.common/Select";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import { EditableInlineContext } from "./EditableInlineContext";
import classNames from "classnames";
import "./editableInputs.scss";

export type EditableInlineInputProps = {
	autoFocus?: boolean;
	defaultElement: ReactElement;
	defaultValue?: string | number | SelectOption[];
	disableEdit?: boolean;
	inputForm: string;
	inputName: string;
	inputType?: "text" | "number" | "radio" | "select";
	isActive?: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	itemId: any;
	onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
	selectedValue?: string | number;
	alignHorizontal?: "left" | "right" | "center";
};

export const EditableInlineInput = ({
	autoFocus,
	alignHorizontal,
	defaultElement,
	defaultValue,
	disableEdit,
	inputForm,
	inputName,
	inputType,
	isActive,
	itemId,
	onKeyDown,
	selectedValue,
	...props
}: EditableInlineInputProps) => {
	const fetchers = useFetchers();
	const fetcher = fetchers?.find(
		(f) => f && f.formData && f.formData.get("id") == itemId
	);

	const { t } = useTranslation();
	const { control } = useContext(EditableInlineContext) as unknown as {
		control: Control;
	};

	const elementProps = defaultElement.props as {
		className?: string;
		children?: ReactNode;
	};

	const clonedElement = cloneElement(defaultElement, {
		className: `editable__text editable__text--inline ${elementProps.className ?? ""}`,
		children:
			inputType === "select" ? (
				<span className="select__inner">
					<span className="select__text">
						{elementProps.children}
					</span>
					<RenderIcon
						icon={Icons.Interface.ArrowDownSmall}
						classes="select__icon invisible"
						sizes=""
					/>
				</span>
			) : (
				elementProps.children
			),
	});

	if (disableEdit) {
		return clonedElement;
	}

	const renderInput = () => {
		const isSelectOptionArray = typeof defaultValue === "object";
		const hasSingleDefaultValue = defaultValue && !isSelectOptionArray;

		switch (inputType) {
			case "number":
				return (
					<Controller
						control={control}
						name={inputName}
						render={({
							field: { onChange, onBlur, name, ref },
						}) => (
							<input
								autoFocus={autoFocus}
								className={classNames(
									`editable__input`,
									` editable__input--inline`,
									alignHorizontal &&
										`!text-${alignHorizontal}`
								)}
								defaultValue={
									hasSingleDefaultValue
										? defaultValue
										: defaultElement?.props.children
								}
								form={inputForm}
								name={name}
								onBlur={onBlur}
								onChange={(event) => {
									onChange(parseFloat(event.target.value));
								}}
								onKeyDown={onKeyDown}
								ref={ref}
								type="number"
								step="any"
							/>
						)}
					/>
				);
			case "radio":
				if (!defaultValue || !isSelectOptionArray) {
					return <></>;
				}

				return (
					<Controller
						control={control}
						name={inputName}
						render={({
							field: { onBlur, onChange, name, ref },
						}) => (
							<div className="editable__input editable__input--inline flex gap-x-8">
								{defaultValue.map((option) => (
									<div
										key={option.value as Key}
										className="flex items-center"
									>
										<input
											autoFocus={autoFocus}
											className="form-radio"
											defaultChecked={
												selectedValue === option.value
											}
											defaultValue={
												option.value as string | number
											}
											form={inputForm}
											id={option.value as string}
											name={name}
											onBlur={onBlur}
											onChange={(event) => {
												onChange(event.target.value);
											}}
											onKeyDown={onKeyDown}
											ref={ref}
											type="radio"
										/>
										<label
											className="pl-4"
											htmlFor={option.value as string}
										>
											{t(option.value as string)}
										</label>
									</div>
								))}
							</div>
						)}
					/>
				);
			case "select":
				if (!defaultValue || !isSelectOptionArray) {
					return <></>;
				}

				return (
					<Controller
						control={control}
						name={inputName}
						render={({
							field: { onBlur, onChange, name, ref, value },
						}) => (
							<>
								<Select
									autoFocus={autoFocus}
									className={`editable__input editable__input--inline`}
									defaultValue={selectedValue}
									value={value}
									form={inputForm}
									onBlur={onBlur}
									onChange={(_event, value) => {
										onChange(value);
									}}
									onKeyDown={onKeyDown}
									ref={ref}
									renderValue={(option) => (
										<span className="select__inner">
											<span className="select__text">
												{option?.label}
											</span>
											<RenderIcon
												icon={
													Icons.Interface
														.ArrowDownSmall
												}
												classes="select__icon [.Mui-expanded_&]:rotate-180"
												sizes=""
											/>
										</span>
									)}
									slotProps={{
										listbox: {
											className:
												"select__listbox select__listbox--inline",
										},
										popup: {
											className: "select__popper",
										},
										root: {
											className: "editable__select",
										},
									}}
								>
									{defaultValue.map((option) => (
										<Option
											key={`${option.value as Key}`}
											slotProps={{
												root: {
													className: "option",
												},
											}}
											value={option.value}
										>
											{option.label ?? option.value}
										</Option>
									))}
								</Select>
								<input
									form={inputForm}
									type="hidden"
									name={name}
									value={value}
								/>
							</>
						)}
					/>
				);

			case "text":
			default:
				return (
					<Controller
						control={control}
						name={inputName}
						render={({
							field: { onBlur, onChange, name, ref },
						}) => (
							<input
								autoFocus={autoFocus}
								className={classNames(
									`editable__input`,
									` editable__input--inline`,
									alignHorizontal &&
										`!text-${alignHorizontal}`
								)}
								defaultValue={
									hasSingleDefaultValue
										? defaultValue
										: defaultElement?.props.children
								}
								form={inputForm}
								name={name}
								onBlur={onBlur}
								onChange={(event) => {
									onChange(event.target.value);
								}}
								onKeyDown={onKeyDown}
								ref={ref}
								type="text"
							/>
						)}
					/>
				);
		}
	};

	return (
		<>
			<div className={`editable editable--inline`} {...props}>
				{isActive && control ? (
					<fieldset
						className={`editable__fieldset ${
							defaultElement?.props.className
								? defaultElement.props.className
								: ""
						}`}
						disabled={
							fetcher?.state === "loading" ||
							fetcher?.state === "submitting"
						}
					>
						{renderInput()}
					</fieldset>
				) : (
					clonedElement
				)}
			</div>
		</>
	);
};
