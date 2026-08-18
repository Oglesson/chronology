import { useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Table } from "../../components/table/Table";
import { NotificationContext } from "../../context.common/NotificationContext";
import { useProcess } from "../../hooks.queries/useProcess";
import { QuestionsContext } from "../process.questions/partials/_QuestionsContext";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";
import { ColourBlob } from "./partials/_ColourBlob";
import { ProcessData, GroupProcessData } from "../../api.common/types";

export const Process = () => {
	const process = useProcess();
	const { t } = useTranslation();
	const { addNotification, removeNotification, notificationExists } =
		useContext(NotificationContext);
	const { percentageComplete } = useContext(QuestionsContext);
	const shouldRemoveNotification = useRef(notificationExists(process.Code));
	const { permissions } = usePermissionsContext();

	useEffect(() => {
		if (shouldRemoveNotification.current) {
			shouldRemoveNotification.current = false;
			removeNotification(process.Code);
			addNotification({
				heading: "Creating Process",
				message: `Process with code ${process.Code} has been successfully created.`,
				type: "success",
			});
		}
	}, [addNotification, process.Code, removeNotification]);

	if (
		process.CreationStatus !== "ocsComplete" &&
		process.CreationStatus !== "ocsImported"
	) {
		return (
			<div className="grid grid-cols-12 items-end">
				<div className="col-span-4">
					<h4 className="typo-h4">
						{t("incompleteProcessMessage", {
							defaultValue:
								"This current Process is incomplete. In order to cost this Process, please answer the questions.",
						})}
					</h4>
					<Link
						to="questions"
						className="button button--primary inline-block mt-12"
					>
						{t("answerQuestions", {
							defaultValue: "Answer Questions",
						})}
					</Link>
				</div>

				<div className="col-span-3 col-start-9">
					<div className="flex flex-col items-end">
						<span className="block typo-pre-heading text-grey-light">
							{t("complete")}
						</span>
						<span className="block typo-h1">
							{percentageComplete}%
						</span>
					</div>
				</div>
			</div>
		);
	}

	switch (process.CategoryKind) {
		case "ocGroup":
			if (!process.Group?.length) {
				return <>There are no processes for this Process</>;
			}
			return (
				<>
					<Table
						actions={{
							menu: [
								{
									label: t("viewProcess", {
										defaultValue: "View Process",
									}),
									url: "/processes/%%Group_OperationID%%",
								},
							],
						}}
						columns={[
							{
								label: "Code",
								accessor: "Code",
								template: (data: GroupProcessData) =>
									data._GroupOperation?.Code,
							},
							{
								label: "Description",
								accessor: "Description",

								template: (data: GroupProcessData) =>
									data._GroupOperation?.Description ?? (
										<>&ndash;</>
									),
							},
							{
								label: (
									<span className="flex items-center before:w-2.5 before:h-2.5 before:rounded-full before:bg-green before:mr-2">
										VA
									</span>
								),
								template: (data: GroupProcessData) =>
									data._GroupOperation?.Calculations?.Basic_Time.Minutes.VA.toFixed(
										2,
									) ?? <>&ndash;</>,
							},
							{
								label: (
									<span className="flex items-center before:w-2.5 before:h-2.5 before:rounded-full before:bg-decline before:mr-2">
										NVA
									</span>
								),
								template: (data: GroupProcessData) =>
									data._GroupOperation?.Calculations?.Basic_Time.Minutes.NVA.toFixed(
										2,
									) ?? <>&ndash;</>,
							},
							{
								label: "Total",
								template: (data: GroupProcessData) =>
									data._GroupOperation?.Calculations?.Basic_Time.Minutes.Total.toFixed(
										2,
									) ?? <>&ndash;</>,
							},
							{
								label: (
									<span className="flex items-center before:w-2.5 before:h-2.5 before:rounded-full before:bg-green before:mr-2">
										VA
									</span>
								),
								template: (data: GroupProcessData) =>
									data._GroupOperation?.Calculations?.Allowed_Time.Minutes.VA.toFixed(
										2,
									) ?? <>&ndash;</>,
							},
							{
								label: (
									<span className="flex items-center before:w-2.5 before:h-2.5 before:rounded-full before:bg-decline before:mr-2">
										NVA
									</span>
								),
								template: (data: GroupProcessData) =>
									data._GroupOperation?.Calculations?.Allowed_Time.Minutes.NVA.toFixed(
										2,
									) ?? <>&ndash;</>,
							},
							{
								label: "Total",
								template: (data: GroupProcessData) =>
									data._GroupOperation?.Calculations?.Allowed_Time.Minutes.Total.toFixed(
										2,
									) ?? <>&ndash;</>,
							},
						]}
						data={process.Group}
						preHeading={
							<tr>
								<th
									className="table__pre-heading"
									colSpan={3}
								></th>

								<th
									className="!text-center table__pre-heading"
									colSpan={3}
								>
									{t("basicMinutes", {
										defaultValue: "Basic Minutes",
									})}
								</th>
								<th
									className="!text-center table__pre-heading"
									colSpan={3}
								>
									{t("allowedMinutes", {
										defaultValue: "Allowed Minutes",
									})}
								</th>
							</tr>
						}
						rows={{
							link: {
								label: t("viewProcess", {
									defaultValue: "View Process",
								}),
								url: "/processes/%%Group_OperationID%%",
							},
						}}
					/>
					{(permissions?.edit || permissions?.admin) &&
						process.CreationStatus !== "ocsImported" && (
							<Link
								to="questions"
								className="button button--primary inline-block mt-12"
							>
								{t("amendQuestions")}
							</Link>
						)}
				</>
			);
		default: {
			if (!process.Steps?.length) {
				if (process.CategoryKind === "ocUnmanned") {
					return (
						<>
							<p>{t("noStepsUnmanned")}</p>
							{(permissions?.edit || permissions?.admin) &&
								process.CreationStatus !== "ocsImported" && (
									<Link
										to="questions"
										className="button button--primary inline-block mt-12"
									>
										{t("amendQuestions")}
									</Link>
								)}
						</>
					);
				} else {
					return <> {t("noSteps")}</>;
				}
			}
			const showMachiningColumns = [
				"ocStitching",
				"ocStrobelStitching",
				"ocFolding",
			].includes(process.CategoryKind || "");

			const cuttingColumns = [
				{
					label: t("type"),
					template: (data) => (
						<ColourBlob
							colourBlobData={`tp-${
								data._Step?.CuttingCategory ?? "ea"
							}`}
						/>
					),
					width: 110,
				},
			];

			return (
				<>
					<Table
						actions={(data: ProcessData) => {
							return {
								menu: !data._Step?.Machining
									? [
											{
												label: t("viewStep", {
													defaultValue: "View Step",
												}),
												url: "/steps/%%StepID%%",
											},
										]
									: undefined,
							};
						}}
						columns={[
							...(process.CategoryKind === "ocCutting"
								? [...cuttingColumns]
								: []),
							{
								label: t("valueAdded"),
								template: (data: ProcessData) =>
									// prettier-ignore
									<ColourBlob
										colourBlobData={`va-${data._Step?.ValueAdded ?? false}`}
									/>,
								width: 110,
							},
							{
								label: t("code"),
								accessor: "_Step.Code",
								template: (data: ProcessData) =>
									data?._Step?.Code,
							},
							{
								label: t("description"),
								accessor: "_Step.Description",
								template: (data: ProcessData) =>
									data?._Step?.Description,
							},
							{
								label: t("simultaneous"),
								accessor: "Simo",
							},
							...(showMachiningColumns
								? [
										{
											label: t("machiningNear"),
											accessor:
												"_Machiningamendment.Description",
											template: (
												data: (typeof process.Steps)[0],
											) => {
												if (
													!data?.MachiningamendmentID ||
													!data?._Machiningamendment
														?.Description
												) {
													return <>&ndash;</>;
												}

												return data._Machiningamendment.Description.replace(
													"*_",
													"",
												);
											},
										},
									]
								: []),
							{
								label: t("minutes"),
								accessor: "_Step.Time_Minutes",
								alignHorizontal: "right",
								template: (data: ProcessData) =>
									data?._Step?.Time_Minutes?.toFixed(4),
							},
							{
								label: t("frequency"),
								accessor: "Quantity",
								alignHorizontal: "right",
								template: (data: ProcessData) =>
									data?.Quantity?.toFixed(2),
							},
							{
								label: t("per"),
								accessor: "PerBatch",
								template: (data: ProcessData) =>
									`${data?.Every} ${
										data?.PerBatch
											? t("batch(es)")
											: t("item(s)")
									}`,
							},
							{
								label: t("batchFrequency"),
								accessor: "PerBatchFreq",
								alignHorizontal: "right",
								template: (data: ProcessData) =>
									data?.PerBatchFreq?.toFixed(2),
							},
							{
								label: t("BMS"),
								accessor: "Basic_Minutes",
								alignHorizontal: "right",
								template: (data: ProcessData) =>
									data?.Basic_Minutes?.toFixed(4),
							},
							...(showMachiningColumns && permissions.admin
								? [
										{
											label: t("cm/sec"),
											accessor:
												"MachiningRate.DistancePerSecond_cms",
											alignHorizontal: "right",
											template: (
												data: (typeof process.Steps)[0],
											) =>
												data?.MachiningRate?.DistancePerSecond_cms?.toFixed(
													2,
												) ?? <>&ndash;</>,
										},
										{
											label: t("speed"),
											accessor:
												"MachiningRate.Speed_StitchesPerMinute",
											alignHorizontal: "right",
											template: (
												data: (typeof process.Steps)[0],
											) =>
												data?.MachiningRate?.Speed_StitchesPerMinute?.toFixed(
													0,
												) ?? <>&ndash;</>,
										},
										{
											label: process.MadeInPairs
												? t("secs/pair")
												: t("secs/single"),
											accessor: "SecsPerUnit",
											alignHorizontal: "right",
											template: (
												data: (typeof process.Steps)[0],
											) =>
												data?.SecsPerUnit?.toFixed(
													2,
												) ?? <>&ndash;</>,
										},
									]
								: []),
						]}
						data={process.Steps}
						rows={{
							link: {
								disabled: (data) =>
									data._Step?.Machining === true,
								label: t("viewStep", {
									defaultValue: "View Step",
								}),
								url: "/steps/%%StepID%%",
							},
							styles: [
								{
									condition: (data) =>
										data.Simo &&
										data.Simo !==
											process.Calculations?.Simo,
									styleName: `line-through`,
								},
							],
						}}
					/>
					{(permissions?.edit || permissions?.admin) &&
						process.CreationStatus !== "ocsImported" && (
							<Link
								to="questions"
								className="button button--primary inline-block mt-12"
							>
								{t("amendQuestions")}
							</Link>
						)}
				</>
			);
		}
	}
};
