import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cloneElement, Fragment, Key, ReactNode, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ItemActionsMenu } from "../ItemActionsMenu/ItemActionsMenu";
import { ResultOrSelf } from "../../utilities.common/ResultOrSelf";
import { toLinkUrl } from "../../utilities.common/StringUtilities";
import {
	TableActionsProps,
	TableColumnProps,
	TableOptionProps,
	TableRowsProps,
} from "./Table";
import "./table.scss";
import { TableRowProvider } from "./TableRowContext";

export type TableRowOptionsProps<T> = TableOptionProps<T> & {
	dragging?: boolean;
	id: UniqueIdentifier;
	index: number;
	sorting?: boolean;
};

export type TableRowProps<T> = {
	actions?:
		| TableActionsProps
		| ((data: T, options: TableOptionProps<T>) => TableActionsProps);
	columns: TableColumnProps<T>[];
	data: T;
	id: Key;
	options: TableRowOptionsProps<T>;
	row?: TableRowsProps<T>;
};

export const TableRow = <T,>({
	actions,
	columns,
	data,
	id,
	options,
	row,
	...props
}: TableRowProps<T>) => {
	const { activeRow, highlightRow } = options;

	const linkDisabled = row?.link?.disabled
		? ResultOrSelf(row?.link.disabled, data, options)
		: null;

	const extraRowClasses = () => {
		if (row?.styles && Array.isArray(row?.styles)) {
			let styleString = "";
			row?.styles?.map((style) => {
				if (ResultOrSelf(style.condition, data)) {
					styleString = `${styleString} ${style.styleName}`;
				}
			});
			return styleString;
		} else {
			return "";
		}
	};

	const sortable = useSortable({ id: id as UniqueIdentifier });

	const {
		attributes,
		listeners,
		transform,
		transition,
		setNodeRef,
		isDragging,
		isSorting,
	} = row?.draggable
		? sortable
		: {
				attributes: undefined,
				listeners: undefined,
				transform: undefined,
				transition: undefined,
				setNodeRef: undefined,
				isDragging: undefined,
				isSorting: undefined,
			};

	const { t } = useTranslation();

	const rowActions = ResultOrSelf(
		actions,
		data,
		options,
	) as TableActionsProps;

	const ContextProvider = row?.context ?? Fragment;

	useLayoutEffect(() => {
		if (options.highlightRow.current === id && !rowActions?.menu?.length) {
			options.highlightRow.set(undefined);
		}
	}, [rowActions?.menu?.length]);

	const rowOptions = {
		...options,
		dragging: isDragging,
		sorting: isSorting,
	};

	return (
		<>
			{rowOptions.index === 0 &&
				ResultOrSelf(row?.around, data, {
					...rowOptions,
					id: undefined,
					index: -1,
				})}
			{rowOptions.index !== 0 &&
				ResultOrSelf(row?.between, data, {
					...rowOptions,
				})}
			<tbody
				{...props}
				{...attributes}
				{...listeners}
				ref={setNodeRef}
				style={
					transform || transition
						? {
								transform: CSS.Transform.toString(transform),
								transition: transition,
							}
						: undefined
				}
				className={`table__tbody ${
					rowActions?.menu?.length || (row?.link && !linkDisabled)
						? `table__tbody--hover${
								id === highlightRow.current
									? " table__tbody--highlight"
									: ""
							}`
						: ""
				}${
					activeRow.current
						? id === activeRow.current
							? " table__tbody--active"
							: " table__tbody--disabled"
						: ""
				}${row?.draggable ? " table__tbody--draggable" : ""}${
					isDragging ? " table__tbody--dragging" : ""
				} group`}
			>
				<ContextProvider>
					<TableRowProvider data={data} options={rowOptions}>
						{ResultOrSelf(row?.before, data, rowOptions)}
						{!ResultOrSelf(row?.hidden, data, rowOptions) && (
							<tr className={`table__tr${extraRowClasses()}`}>
								{row?.link && (
									<td className="w-0 p-0">
										{!linkDisabled && (
											<Link
												className="table__link"
												to={toLinkUrl(
													row?.link.url,
													data,
												)}
											>
												<span className="sr-only">
													{row?.link.label}
												</span>
											</Link>
										)}
									</td>
								)}

								{columns.map((column, columnIndex) => {
									if (column.hidden) {
										return;
									}

									let val: T[keyof T] | string | T =
										column.accessor ? data : "";

									const accessors =
										column?.accessor?.split(".");

									if (val && accessors) {
										for (const key of accessors) {
											if (
												!(val as T)[
													key as keyof typeof data
												]
											) {
												val = "";
												continue;
											}

											val = (val as T)[
												key as keyof typeof data
											];
										}
									}

									let td = val as ReactNode;

									if (val == undefined || val === "") {
										td = <>&ndash;</>;
									} else if (typeof val === "boolean") {
										if (val) {
											td = t("yes", {
												defaultValue: "Yes",
											});
										} else {
											td = t("no", {
												defaultValue: "No",
											});
										}
									}

									return (
										<td
											key={column.accessor ?? columnIndex}
											className={
												column.className ??
												`table__td ${
													column.alignHorizontal
														? `table__td--${ResultOrSelf(
																column.alignHorizontal,
																data,
																rowOptions,
															)}`
														: ""
												} ${
													column.alignVertical
														? `table__td--${ResultOrSelf(
																column.alignVertical,
																data,
																rowOptions,
															)}`
														: ""
												}`
											}
											width={column.width}
										>
											{column.template
												? typeof column.template ===
													"function"
													? column.template(
															data,
															rowOptions,
														)
													: cloneElement(
															column.template,
															[props],
															[
																column.template
																	.props
																	.children,
																...[td],
															],
														)
												: td}
										</td>
									);
								})}

								{actions && (
									<td
										className={`table__td table__td--actions ${
											row?.link
												? "pointer-events-none [&_>_*]:pointer-events-auto"
												: ""
										}`}
									>
										<div className="min-w-[6.75rem]">
											{rowActions?.inline?.map(
												(action, actionIndex) => {
													return (
														<Fragment
															key={actionIndex}
														>
															{action}
														</Fragment>
													);
												},
											)}
											{!!rowActions?.menu?.length && (
												<ItemActionsMenu
													actions={rowActions.menu}
													buttonClasses={`${
														id ===
														highlightRow.current
															? "opacity-100"
															: "opacity-0 group-hover:opacity-100"
													}`}
													buttonLabel={t(
														"moreActions",
														{
															defaultValue:
																"More Actions",
														},
													)}
													data={data}
													interactionIntent={
														rowActions.interactionIntent
													}
													toggle={(isOpen) => {
														if (isOpen) {
															highlightRow.set(
																id,
															);
														} else if (
															highlightRow.current ===
															id
														) {
															highlightRow.set(
																undefined,
															);
														}
													}}
													open={
														isSorting
															? false
															: undefined
													}
													onKeyDown={(event) => {
														event.stopPropagation();
													}}
													onPointerDown={(event) => {
														event.stopPropagation();
													}}
												/>
											)}
										</div>
									</td>
								)}
							</tr>
						)}
						{ResultOrSelf(row?.after, data, rowOptions)}
					</TableRowProvider>
				</ContextProvider>
			</tbody>
			{ResultOrSelf(row?.around, data, rowOptions)}
		</>
	);
};
