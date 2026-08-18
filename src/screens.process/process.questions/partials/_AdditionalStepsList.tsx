import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Table } from "../../../components/table/Table";
import { EditAdditionalStep } from "./_EditAdditionalStep";
import { QuestionsContext } from "./_QuestionsContext";
import { RemoveAdditionalStep } from "./_RemoveAdditionalStep";

export const AdditionalStepsList = () => {
	const { additionalStepsQuestionsState } = useContext(QuestionsContext);
	const { t } = useTranslation();

	if (additionalStepsQuestionsState.value.length < 1) {
		return <></>;
	}

	return (
		<Table
			data={additionalStepsQuestionsState.value}
			actions={(data) => {
				return {
					menu: [
						{
							step: (
								<EditAdditionalStep
									index={additionalStepsQuestionsState.value.indexOf(
										data
									)}
								/>
							),
						},
						{
							step: (
								<RemoveAdditionalStep
									index={additionalStepsQuestionsState.value.indexOf(
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
					accessor: "_Step.Code",
					label: t("step"),
					template: (data) => <>{data._Step?.Code}</>,
				},
				{
					accessor: "Quantity",
					label: t("quantity"),
					template: (data) => `${data?.Quantity.toFixed(4)}`,
				},

				{
					accessor: "PerBatch",
					label: t("per"),
					template: (data) =>
						`${data?.Every} ${
							data?.PerBatch ? t("batch(es)") : t("item(s)")
						}`,
				},
			]}
		/>
	);
};
