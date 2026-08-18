import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NoResults } from "../common/results/NoResults";
import { Table, TableColumnProps, TableProps } from "./Table";

type SearchableTableProps<T> = TableProps<T> & {
	columns: {
		searchable?: boolean;
	}[];
	strategy?: "startsWith" | "includes";
};

export const SearchableTable = <T,>({
	actions,
	columns,
	data,
	rows,
	tableClassName,
	strategy,
	...props
}: SearchableTableProps<T>) => {
	const { t } = useTranslation();
	const [searchTerm, setSearchTerm] = useState("");

	const searchableKeys = (
		columns as (TableColumnProps<T> & {
			searchable?: boolean;
		})[]
	).reduce((previous, current) => {
		if (current.searchable && current.accessor) {
			previous.push(current.accessor);
		}
		return previous;
	}, [] as string[]);

	const searchMethod = strategy ?? "startsWith";
	const filteredData = data.filter((x) =>
		searchableKeys.findIndex((key) => {
			const value = x[key as keyof T]?.toString().toLowerCase();
			return value !== undefined && (value[searchMethod as keyof string] as (s: string) => boolean)(searchTerm.toLowerCase());
		}) !== -1
	);

	return (
		<div className="grid-container" {...props}>
			<input
				type="search"
				placeholder={`${t("search")}...`}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="form-input form-input--rounded search-icon mb-24 col-span-5"
			/>

			{filteredData.length ? (
				<div className="col-span-full">
					<Table
						actions={actions}
						columns={columns}
						data={filteredData}
						rows={rows}
						tableClassName={tableClassName}
					/>
				</div>
			) : (
				<NoResults className="col-span-5 col-start-1" />
			)}
		</div>
	);
};
