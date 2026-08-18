import { useTranslation } from "react-i18next";
import { ItemActionsMenu } from "../../../components/ItemActionsMenu/ItemActionsMenu";
import Icons from "../../../config.common/Icons";
import { useDesignDepartment } from "../../../hooks.queries/useDesignDepartment";
import { Delete } from "./_Delete";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";
import { useDesign } from "../../../hooks.queries/useDesign";
import { useContext, useEffect } from "react";
import { DesignContext } from "../../design.index/partials/_DesignContext";
import { EditableField } from "../../../components/edit/EditableField";
import {
	useBatchSizeFieldSchema,
	usePairsCostedFieldSchema,
} from "../../../hooks.schema/fields";
import { AMS } from "./_AMS";

export const Details = () => {
	const style = useDesign();
	const styleDepartment = useDesignDepartment();
	const { madeInPairsStatus, setMadeInPairsStatusPicker, costedLabel } =
		useContext(DesignContext);
	const pairsCostedFieldSchema = usePairsCostedFieldSchema();
	const batchSizeFieldSchema = useBatchSizeFieldSchema(2000);
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();

	useEffect(() => {
		if (styleDepartment.MadeInPairsStatus) {
			setMadeInPairsStatusPicker(styleDepartment.MadeInPairsStatus);
		}
	}, [styleDepartment.MadeInPairsStatus, setMadeInPairsStatusPicker]);

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
									<Delete styleDepartment={styleDepartment} />
								),
							},
						]}
						data={styleDepartment}
						buttonIcon={Icons.Interface.MoreHorizontal}
						buttonLabel={t("moreActions", {
							defaultValue: "More Actions",
						})}
					/>
				</div>
				<div className="grid-container">
					<div className="col-span-9">
						<span className="block text-grey-light mb-1.5">
							Department
						</span>
						<h1 className="editable__text typo-large">
							{styleDepartment?._Department?.Description}
						</h1>
					</div>
				</div>
			</div>

			<div className="grid-container mb-16">
				<div className="col-span-6">
					<div>
						<span className="text-grey-light mb-1.5">Style</span>
						<div className="editable__text typo-h5">
							{style.Code}
						</div>
					</div>
					<div className="mt-7">
						<span className="block text-grey-light mb-1.5">
							{t("madeInPairs", {
								defaultValue: "Made in pairs",
							})}
						</span>
						<div
							className={`editable__text typo-h5${
								styleDepartment?.MadeInPairsStatus ===
								"mipsMixed"
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
							<div className="typo-h5 max-w-[15.3rem]">
								{styleDepartment?.BatchSize}
							</div>
						}
						disableEdit={!(permissions?.edit || permissions?.admin)}
						inputName="batchSize"
						inputType="number"
						label={t("batchSize")}
						schema={batchSizeFieldSchema}
					/>
					<EditableField
						className="mt-7"
						defaultElement={
							<div className="typo-h5 max-w-[15.3rem]">
								{styleDepartment?.PairsCosted}
							</div>
						}
						disableEdit={!(permissions?.edit || permissions?.admin)}
						inputName="pairsCosted"
						inputType="number"
						label={costedLabel ?? ""}
						schema={pairsCostedFieldSchema}
					/>
				</div>
				{styleDepartment?.MadeInPairsStatus !== "mipsMixed" ? (
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
