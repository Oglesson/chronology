import { UniqueIdentifier } from "@dnd-kit/core";
import {
	SlotComponentProps,
	TablePaginationActions,
	TablePagination,
	TablePaginationActionsSlotProps,
	TablePaginationRootSlotPropsOverrides,
	TablePaginationOwnerState,
} from "@mui/base";
import {
	Dispatch,
	Key,
	ReactNode,
	SetStateAction,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import { ActionProps } from "../ItemActionsMenu/ItemActionsMenu";
import Icons from "../../config.common/Icons";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import { ResultOrSelf } from "../../utilities.common/ResultOrSelf";
import "./table.scss";
import { TableDnd, TableRowDnd } from "./TableDnd";
import { TableRow, TableRowOptionsProps } from "./TableRow";
import { DefaultTReturn, TOptions } from "i18next";

export type TableActionsProps = {
	inline?: ReactNode[];
	menu?: ActionProps[];
	interactionIntent?: () => void | Promise<void>;
};

export type TableColumnProps<T> = {
	accessor?: string;
	alignHorizontal?:
		| TableHorizontalProps
		| ((data: T, options: TableRowOptionsProps<T>) => TableHorizontalProps);
	alignVertical?:
		| TableVerticalProps
		| ((data: T, options: TableRowOptionsProps<T>) => TableVerticalProps);
	className?: string;
	hidden?: boolean;
	label?: ReactNode | DefaultTReturn<TOptions>;
	sortable?: boolean;
	sortNumeric?: boolean;
	sortOrder?: "asc" | "desc";
	span?: number;
	template?:
		ReactNode | ((data: T, options: TableRowOptionsProps<T>) => ReactNode);
	width?: string | number;
};
export type TableRowsProps<T> = {
	link?: TableLinkProps<T>;
	draggable?: boolean;
	before?:
		ReactNode | ((data: T, options: TableRowOptionsProps<T>) => ReactNode);
	after?:
		ReactNode | ((data: T, options: TableRowOptionsProps<T>) => ReactNode);
	between?:
		ReactNode | ((data: T, options: TableRowOptionsProps<T>) => ReactNode);
	around?:
		ReactNode | ((data: T, options: TableRowOptionsProps<T>) => ReactNode);
	hidden?: boolean | ((data: T, options: TableRowOptionsProps<T>) => boolean);
	context?: (props: {
		children: ReactNode;
		[key: string]: unknown;
	}) => ReactNode;
	styles?: TableRowStyles<T>[];
};
export type TableHorizontalProps = "left" | "right" | "center";
export type TableVerticalProps = "top" | "middle" | "bottom";
export type TableOptionProps<_T> = {
	activeRow: {
		current: Key | undefined;
		set: Dispatch<SetStateAction<Key | undefined>>;
	};
	highlightRow: {
		current: Key | undefined;
		set: Dispatch<SetStateAction<Key | undefined>>;
	};
};

export type TableLinkProps<T> = {
	disabled?: boolean | ((data: T, options: TableOptionProps<T>) => boolean);
	label: string;
	url: string;
};

export type TableRowStyles<T> = {
	condition: boolean | ((data: T, options: TableOptionProps<T>) => boolean);
	styleName: string;
};

export type TableProps<T> = {
	actions?:
		| TableActionsProps
		| ((data: T, options: TableOptionProps<T>) => TableActionsProps);
	columns: TableColumnProps<T>[];
	data: T[];
	dataChange?: (data: T[]) => void;
	preHeading?:
		ReactNode | ((data: T, options: TableOptionProps<T>) => ReactNode);
	rows?: TableRowsProps<T>;
	tableClassName?: string;
};

export const Table = <T,>({
	actions,
	columns,
	data,
	dataChange,
	preHeading,
	rows,
	tableClassName,
	...props
}: TableProps<T>) => {
	const createRowIDs = (data: T[]) => {
		return data?.map((item, index) => {
			return (item["ID" as keyof T] ?? `${index}`) as UniqueIdentifier;
		});
	};

	const dataRef = useRef<string>(undefined);
	const tableRef = useRef<HTMLTableElement>(null);
	const [tableData, setTableData] = useState<T[]>(data);
	const [sortField, setSortField] = useState<string>();
	const [tSortOrder, setTSortOrder] =
		useState<TableColumnProps<T>["sortOrder"]>();
	const [highlightRow, setHighlightRow] = useState<Key>();
	const [activeRowKey, setActiveRowKey] = useState<Key>();
	const [rowIDs, setRowIDs] = useState<UniqueIdentifier[]>(
		createRowIDs(tableData),
	);
	const [page, setPage] = useState<number>(0);

	const rowsPerPage = 20;

	const options: TableOptionProps<T> = {
		activeRow: {
			current: activeRowKey,
			set: setActiveRowKey,
		},
		highlightRow: {
			current: highlightRow,
			set: setHighlightRow,
		},
	};
	const { t } = useTranslation();

	const handleSorting = (
		sField: string,
		sOrder: TableColumnProps<T>["sortOrder"],
		sNumeric?: boolean,
	) => {
		if (sField) {
			const sorted = [...data].sort(
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(a: Record<keyof T, any>, b: Record<keyof T, any>) => {
					const accessors = sField.split(".");

					if (accessors) {
						for (const key of accessors) {
							a = a[key as keyof T];
							b = b[key as keyof T];
						}
					}

					if (a == null) return 1;
					if (b == null) return -1;
					if (a == null && b == null) return 0;
					return (
						(a as string | number)
							.toString()
							.localeCompare(
								(b as string | number).toString(),
								"en",
								{
									numeric: sNumeric,
								},
							) * (sOrder === "asc" ? 1 : -1)
					);
				},
			);
			setTableData(sorted);
			setRowIDs(createRowIDs(sorted));
		}
	};

	const handleSortingChange = (accessor: string, sNumeric?: boolean) => {
		const order =
			accessor === sortField && tSortOrder === "asc" ? "desc" : "asc";
		setSortField(accessor);
		setTSortOrder(order);
		handleSorting(accessor, order, sNumeric);
	};

	useLayoutEffect(() => {
		const sortDefault = columns.find(
			(column) => column.sortable && column.sortOrder,
		);

		if (sortDefault?.accessor) {
			setSortField(sortDefault.accessor);
			setTSortOrder(sortDefault.sortOrder);
			handleSorting(
				sortDefault.accessor,
				sortDefault.sortOrder,
				sortDefault.sortNumeric,
			);
		} else {
			setTableData(data);
			setRowIDs(createRowIDs(data));
		}

		setPage(0);
	}, [data]);

	useLayoutEffect(() => {
		if (dataChange) {
			const newTableData = JSON.stringify(tableData);
			if (dataRef.current && dataRef.current !== newTableData) {
				dataChange?.(tableData);
			}
			dataRef.current = newTableData;
		}
	}, [tableData]);

	if (!tableData) {
		return <></>;
	}

	return (
		<TableDnd
			draggable={rows?.draggable}
			setTableData={setTableData}
			setRowIDs={setRowIDs}
		>
			<div className={`table__responsive`} {...props}>
				<table
					ref={tableRef}
					className={`table ${tableClassName ?? ""}`}
				>
					<thead className="table__thead">
						{ResultOrSelf(preHeading, data, {
							...options,
						})}
						<tr className={`table__tr`}>
							{rows?.link && (
								<th className="w-0 p-0">
									<span className="sr-only">
										{rows?.link.label}
									</span>
								</th>
							)}
							{columns.map((column, columnIndex) => {
								if (column.hidden) {
									return;
								}
								return (
									(column.span === undefined ||
										column.span > 0) && (
										<th
											className={
												column.className ??
												`table__th ${
													column.alignHorizontal
														? `table__th--${column.alignHorizontal}`
														: ""
												} ${
													column.sortable
														? "table__th--sortable"
														: ""
												}`
											}
											key={column.accessor ?? columnIndex}
											onClick={() =>
												column.sortable &&
												column.accessor &&
												handleSortingChange(
													column.accessor,
												)
											}
											colSpan={column.span}
										>
											<div className={`table__heading`}>
												{column.label}{" "}
												{column.sortable && (
													<div className="table__sort">
														{((sortField ===
															column.accessor &&
															tSortOrder ===
																"asc") ||
															sortField !==
																column.accessor) && (
															<RenderIcon
																icon={
																	Icons
																		.Interface
																		.ArrowDownSmall
																}
																classes={`table__sort-asc`}
																sizes=""
															/>
														)}
														{((sortField ===
															column.accessor &&
															tSortOrder ===
																"desc") ||
															sortField !==
																column.accessor) && (
															<RenderIcon
																icon={
																	Icons
																		.Interface
																		.ArrowDownSmall
																}
																classes={`table__sort-desc`}
																sizes=""
															/>
														)}
													</div>
												)}
											</div>
										</th>
									)
								);
							})}
							{actions && (
								<th className="table__th table__th--actions">
									<span className="sr-only">
										{t("moreActions", {
											defaultValue: "More Actions",
										})}
									</span>
								</th>
							)}
						</tr>
					</thead>
					<TableRowDnd draggable={rows?.draggable} rowIDs={rowIDs}>
						<>
							{(rowsPerPage > 0
								? tableData.slice(
										page * rowsPerPage,
										page * rowsPerPage + rowsPerPage,
									)
								: tableData
							).map((rowData, rowIndex) => {
								const rowKey =
									rowIDs[rowIndex + page * rowsPerPage];
								return rowKey ? (
									<TableRow
										actions={actions}
										columns={columns}
										data={rowData}
										id={rowKey}
										key={rowKey}
										options={{
											...options,
											id: rowKey,
											index: rowIndex,
										}}
										row={rows}
									/>
								) : undefined;
							})}
						</>
					</TableRowDnd>

					<tfoot className="table__tfoot">
						{tableData.length > rowsPerPage && (
							<tr
								className={
									activeRowKey
										? "text-grey-mid"
										: "text-grey-light"
								}
							>
								<TablePagination
									rowsPerPageOptions={[]}
									count={tableData.length}
									rowsPerPage={rowsPerPage}
									page={page}
									onPageChange={(_event, newPage) => {
										setPage(newPage);
										setHighlightRow(undefined);
										setActiveRowKey(undefined);
										tableRef.current?.scrollIntoView(true);
									}}
									labelDisplayedRows={({ from, to, count }) =>
										`Showing ${from} to ${to} of ${count} results`
									}
									slots={{
										actions: (
											props: TablePaginationActionsSlotProps,
										) => (
											<TablePaginationActions
												slots={{
													nextButton: (props) => (
														<button
															className={`table-pagination__button`}
															disabled={
																props.disabled ||
																!!activeRowKey
															}
															onClick={
																props.onClick
															}
														>
															<span className="sr-only">
																{t(
																	"paginationNext",
																)}
															</span>
															<RenderIcon
																icon={
																	Icons
																		.Interface
																		.ArrowNextSmall
																}
																sizes="w-3.5 h-3.5"
															/>
														</button>
													),
													backButton: (props) => (
														<button
															className={`table-pagination__button`}
															disabled={
																props.disabled ||
																!!activeRowKey
															}
															onClick={
																props.onClick
															}
														>
															<span className="sr-only">
																{t(
																	"paginationBack",
																)}
															</span>
															<RenderIcon
																icon={
																	Icons
																		.Interface
																		.ArrowBackSmall
																}
																sizes="w-3.5 h-3.5"
															/>
														</button>
													),
												}}
												showFirstButton={false}
												showLastButton={false}
												{...props}
											/>
										),
										spacer: () => null,
									}}
									slotProps={{
										actions: {
											className:
												"table-pagination__actions",
										},
										displayedRows: {
											className: "table-pagination__text",
										},
										toolbar: {
											className:
												"table-pagination__toolbar",
										},
										root: {
											className: "table-pagination",
											colSpan:
												columns.filter(
													(column) => !column.hidden,
												).length + (rows?.link ? 1 : 0),
										} as SlotComponentProps<
											"td",
											TablePaginationRootSlotPropsOverrides,
											TablePaginationOwnerState
										>,
									}}
								/>
							</tr>
						)}
					</tfoot>
				</table>
			</div>
		</TableDnd>
	);
};
