import { useContext, useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { useTranslation } from "react-i18next";
import { ItemActionsMenu } from "../../../components/ItemActionsMenu/ItemActionsMenu";
import { EditableField } from "../../../components/edit/EditableField";
import Icons from "../../../config.common/Icons";
import { useDesign } from "../../../hooks.queries/useDesign";
import {
	useCodeFieldSchema,
	useDescriptionFieldSchema,
	usePairsCostedFieldSchema,
} from "../../../hooks.schema/fields";
import { AMS } from "./_AMS";
import { Delete } from "./_Delete";
import { Copy } from "./_Copy";
import { useDesigns } from "../../../hooks.queries/useDesigns";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";
import { DesignContext } from "./_DesignContext";
import { Button } from "../../../components/common/button/Button";
import api from "../../../api.common";
import { NotificationContext } from "../../../context.common/NotificationContext";

export const Details = () => {
	const { processResponse } = useContext(NotificationContext);
	const style = useDesign();
	const { styleCodes } = useDesigns();
	const descriptionFieldSchema = useDescriptionFieldSchema();
	const pairsCostedFieldSchema = usePairsCostedFieldSchema();
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();
	const { madeInPairsStatus, setMadeInPairsStatusPicker, costedLabel } =
		useContext(DesignContext);
	const [csvFileName, setCSVFileName] = useState<undefined | string>(
		undefined,
	);

	const processError = (err: AxiosError) => {
		processResponse({
			code: err.code,
			message: JSON.stringify(err.response?.data),
		});
	};

	const deleteCSV = async (filename: string) => {
		if (filename && filename !== "pending") {
			api.deleteStyleCSV(filename)
				.then(() => {
					setCSVFileName("done");
				})
				.catch((e: AxiosError) => {
					setCSVFileName(filename);
					processError(e);
				});
		}
	};

	useEffect(() => {
		if (style) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setCSVFileName("pending");
			const filename = `${style.Code}.csv`;
			api.getStyleCSVExistsStatus(filename)
				.then((response: AxiosResponse) => {
					if (response.data.Exists) {
						deleteCSV(filename);
					}
				})
				.catch((e: AxiosError) => {
					processError(e);
				})
				.finally(() => {
					setCSVFileName(undefined);
				});
		}
	}, [style]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (style.MadeInPairsStatus) {
			setMadeInPairsStatusPicker(style.MadeInPairsStatus);
		}
	}, [style.MadeInPairsStatus]); // eslint-disable-line react-hooks/exhaustive-deps

	const createCSV = async (id?: number) => {
		if (id) {
			setCSVFileName("pending");
			api.getCreateStyleCSV(id)
				.then((response: AxiosResponse) => {
					setCSVFileName(response.data.Filename);
				})
				.catch((e: AxiosError) => {
					setCSVFileName(undefined);
					processError(e);
				});
		}
	};

	const downloadCSV = async () => {
		if (csvFileName && csvFileName !== "pending") {
			api.getStyleCSVDownload(csvFileName)
				.then((response: AxiosResponse) => {
					const csvData = new Blob([response.data], {
						type: "text/csv",
					});
					const csvurl = URL.createObjectURL(csvData);
					const csvlink = document.createElement("a");
					csvlink.href = csvurl;
					csvlink.download = csvFileName;
					document.body.appendChild(csvlink);
					csvlink.click();
					document.body.removeChild(csvlink);
					URL.revokeObjectURL(csvurl);
					deleteCSV(csvFileName);
				})
				.catch((e: AxiosError) => {
					console.log("e", e);
					processError(e);
				});
		}
	};

	return (
		<>
			<div className="relative mb-14">
				<div className="absolute top-10 right-0">
					<ItemActionsMenu
						className="float-right"
						actions={[
							{
								step: (permissions?.edit ||
									permissions?.admin) && (
									<Copy style={style} />
								),
							},
							{
								step: (permissions?.edit ||
									permissions?.admin) && (
									<Delete style={style} />
								),
							},
						]}
						data={style}
						buttonIcon={Icons.Interface.MoreHorizontal}
						buttonLabel={t("moreActions", {
							defaultValue: "More Actions",
						})}
					/>
					{
						<Button
							className="mr-4"
							text={
								!csvFileName
									? t("exportAsCSV")
									: csvFileName !== "pending"
										? t("downLoadCSV")
										: t("CSVcreate")
							}
							disabled={
								csvFileName === "pending" ||
								csvFileName === "done"
							}
							onClick={() =>
								!csvFileName
									? createCSV(style?.ID)
									: downloadCSV()
							}
						/>
					}
				</div>
				<div className="grid-container">
					<div className="col-span-9">
						<EditableField
							defaultElement={
								<h1 className="typo-large">{style?.Code}</h1>
							}
							inputName="code"
							label={t("code")}
							schema={useCodeFieldSchema(styleCodes, style?.Code)}
							disableEdit={
								!(permissions?.edit || permissions?.admin)
							}
						/>
					</div>
				</div>
			</div>
			<div className="grid-container mb-16">
				<div className="col-span-6">
					<EditableField
						defaultElement={
							<p className="typo-h5">{style?.Description}</p>
						}
						disableEdit={!(permissions?.edit || permissions?.admin)}
						inputName="description"
						label={t("description")}
						schema={descriptionFieldSchema}
					/>
					<div className="mt-7">
						<span className="block text-grey-light mb-1.5">
							{t("madeInPairs", {
								defaultValue: "Made in pairs",
							})}
						</span>
						<div
							className={`editable__text typo-h5${
								style?.MadeInPairsStatus === "mipsMixed"
									? " text-decline"
									: ""
							}`}
						>
							{madeInPairsStatus}
						</div>
					</div>
					<EditableField
						className="mt-7"
						defaultElement={
							<p className="typo-h5 max-w-[15.3rem]">
								{style?.PairsCosted}
							</p>
						}
						disableEdit={!(permissions?.edit || permissions?.admin)}
						inputName="pairsCosted"
						label={costedLabel ?? ""}
						inputType="number"
						schema={pairsCostedFieldSchema}
					/>
				</div>
				{style?.MadeInPairsStatus !== "mipsMixed" ? (
					<div className="col-span-6">
						<div className="max-w-md ml-auto">
							<AMS />
						</div>
					</div>
				) : null}
			</div>
		</>
	);
};
