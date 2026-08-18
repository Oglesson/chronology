import { useContext } from "react";
import { Table } from "../../../components/table/Table";
import { EditKnife } from "./_EditKnife";
import { QuestionsContext } from "./_QuestionsContext";
import { RemoveKnife } from "./_RemoveKnife";
import { useTranslation } from "react-i18next";

export const KnivesList = () => {
	const { knivesQuestionsState } = useContext(QuestionsContext);
	const { t } = useTranslation();

	if (knivesQuestionsState.value.length < 1) {
		return <></>;
	}

	return (
		<Table
			data={knivesQuestionsState.value}
			actions={(data) => {
				return {
					menu: [
						{
							step: (
								<EditKnife
									index={knivesQuestionsState.value.indexOf(
										data
									)}
								/>
							),
						},
						{
							step: (
								<RemoveKnife
									index={knivesQuestionsState.value.indexOf(
										data
									)}
								/>
							),
						},
					],
				};
			}}
			columns={[
				{
					accessor: "Description",
					label: t("description"),
				},
				{ accessor: "Freq", label: t("frequency") },
				{ accessor: "NettArea", label: t("nettArea") },
				{ accessor: "Pieces", label: t("pieces") },
				{ accessor: "Peels", label: t("peels") },
				{ accessor: "Clears", label: t("clears") },
				{
					accessor: "CutsLR",
					label: t("cutsLR"),
					template: (data) => <>{data.CutsLR ? t("yes") : t("no")}</>,
				},
				{
					accessor: "Thin",
					label: t("tool"),
					template: (data) => <>{data.Thin ? t("yes") : t("no")}</>,
				},
				{ accessor: "Bands", label: t("bands") },
				{ accessor: "Marks", label: t("marks") },
			]}
		/>
	);
};
