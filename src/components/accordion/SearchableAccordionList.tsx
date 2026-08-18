import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NoResults } from "../common/results/NoResults";
import { AccordionList, AccordionListProps } from "./AccordionList";

type SearchableAccordionListProps = AccordionListProps & {
	strategy?: "startsWith" | "includes";
};

export const SearchableAccordionList = ({
	actions,
	accordionData,
	className,
	summaryField,
	rowsPerPage = 0,
	accordionContent,
	strategy,
}: SearchableAccordionListProps) => {
	const { t } = useTranslation();
	const [searchTerm, setSearchTerm] = useState("");

	const searchMethod = strategy ?? "startsWith";
	const filteredData = accordionData.filter((x) =>
		[summaryField].findIndex((key) => {
			const value = (x[key as keyof typeof x] as unknown)?.toString().toLowerCase();
			return value !== undefined && (value[searchMethod as keyof string] as (s: string) => boolean)(searchTerm.toLowerCase());
		}) !== -1
	);

	return (
		<div className="grid-container">
			<input
				type="search"
				placeholder={`${t("search")}...`}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="form-input form-input--rounded search-icon mb-24 col-span-5"
			/>

			{filteredData.length ? (
				<div className="col-span-full">
					<AccordionList
						className={className}
						rowsPerPage={rowsPerPage}
						accordionData={filteredData}
						summaryField={summaryField}
						accordionContent={accordionContent}
						actions={actions}
					/>
				</div>
			) : (
				<NoResults className="col-span-5 col-start-1" />
			)}
		</div>
	);
};
