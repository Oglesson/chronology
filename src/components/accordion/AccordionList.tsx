import {
	DetailedHTMLProps,
	ReactNode,
	useRef,
	useState,
	Key,
	AllHTMLAttributes,
} from "react";
import {
	SlotComponentProps,
	TablePaginationActions,
	TablePagination,
	TablePaginationActionsSlotProps,
	TablePaginationRootSlotPropsOverrides,
	TablePaginationOwnerState,
} from "@mui/base";
import { useTranslation } from "react-i18next";
import { ActionProps } from "../ItemActionsMenu/ItemActionsMenu";
import Icons from "../../config.common/Icons";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import { Accordion } from "./Accordion";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnknownProp = { [key: string]: any };

export type AccordionListProps = DetailedHTMLProps<
	AllHTMLAttributes<HTMLUListElement>,
	HTMLUListElement
> & {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	actions?: (item: any) => {
		interactionIntent?: () => void | Promise<void>;
		items: ActionProps[];
	};
	accordionData: object[];
	summaryField: string;
	rowsPerPage: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	accordionContent: (item: any) => ReactNode;
};

export const AccordionList = ({
	actions,
	accordionData,
	className,
	summaryField,
	rowsPerPage = 0,
	accordionContent,
	...props
}: AccordionListProps) => {
	const { t } = useTranslation();

	const [prevAccordionData, setPrevAccordionData] = useState(accordionData);
	const [page, setPage] = useState<number>(0);
	const [activeRowKey, setActiveRowKey] = useState<Key>();

	const listRef = useRef<HTMLUListElement>(null);

	if (prevAccordionData !== accordionData) {
		setPrevAccordionData(accordionData);
		setPage(0);
	}

	return (
		<>
			<ul ref={listRef} className={` ${className ?? ""}`} {...props}>
				{(rowsPerPage > 0
					? accordionData.slice(
							page * rowsPerPage,
							page * rowsPerPage + rowsPerPage,
						)
					: accordionData
				).map((item: UnknownProp) => {
					return (
						<li className="select-none" key={item[summaryField]}>
							<Accordion
								summary={item[summaryField]}
								actions={actions && item && actions(item)}
							>
								{accordionContent(item)}
							</Accordion>
						</li>
					);
				})}
			</ul>
			{accordionData.length > rowsPerPage && (
				<TablePagination
					rowsPerPageOptions={[]}
					count={accordionData.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={(_event, newPage) => {
						setPage(newPage);
						setActiveRowKey(undefined);
						listRef.current?.scrollIntoView(true);
					}}
					labelDisplayedRows={({ from, to, count }) =>
						`Showing ${from} to ${to} of ${count} results`
					}
					slots={{
						root: "div",
						actions: (props: TablePaginationActionsSlotProps) => (
							<TablePaginationActions
								slots={{
									nextButton: (props) => (
										<button
											className={`table-pagination__button`}
											disabled={
												props.disabled || !!activeRowKey
											}
											onClick={props.onClick}
										>
											<span className="sr-only">
												{t("paginationNext")}
											</span>
											<RenderIcon
												icon={
													Icons.Interface
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
												props.disabled || !!activeRowKey
											}
											onClick={props.onClick}
										>
											<span className="sr-only">
												{t("paginationBack")}
											</span>
											<RenderIcon
												icon={
													Icons.Interface
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
							className: "table-pagination__actions",
						},
						displayedRows: {
							className: "table-pagination__text",
						},
						toolbar: {
							className: "table-pagination__toolbar",
						},
						root: {
							className: "table-pagination",
						} as SlotComponentProps<
							"td",
							TablePaginationRootSlotPropsOverrides,
							TablePaginationOwnerState
						>,
					}}
				/>
			)}
		</>
	);
};
