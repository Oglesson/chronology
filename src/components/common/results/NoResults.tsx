import { useTranslation } from "react-i18next";

export const NoResults = ({ ...props }) => {
	const { t } = useTranslation();

	return (
		<div {...props}>
			<p className="typo-h2">
				{t("noResultsHeading", {
					defaultValue:
						"No results were found that match your search",
				})}
				...
			</p>
			<p className="text-grey-light mt-6">
				{t("noResultsBody", {
					defaultValue: "Try modifying your search criteria",
				})}
			</p>
		</div>
	);
};
