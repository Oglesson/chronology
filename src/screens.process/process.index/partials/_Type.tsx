import { useTranslation } from "react-i18next";
import { useProcess } from "../../../hooks.queries/useProcess";
import { useProcessCategories } from "../../../hooks.queries/useProcessCategories";

export const Type = () => {
	const process = useProcess();
	const { processCategories } = useProcessCategories();
	const category = processCategories.find(
		(c) => c.Kind === process.CategoryKind
	);
	const { t } = useTranslation();

	return (
		<div className="mt-6.5 p-8 bg-white dark:bg-black-subtle rounded-md">
			{category && (
				<h4 className="typo-h4 mb-8">{category.Description}</h4>
			)}
			<div className="grid-container">
				<div className="col-span-6">
					<h5 className="typo-pre-heading text-grey-light mb-1.5">
						{t("class")}
					</h5>
					<span>{process._Type?._Class?.Description}</span>
				</div>
				<div className="col-span-6">
					<h5 className="typo-pre-heading text-grey-light mb-1.5">
						{t("type")}
					</h5>
					<span>{process._Type?.Description}</span>
				</div>
			</div>
		</div>
	);
};
