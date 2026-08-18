import { useTranslation } from "react-i18next";
import { EditableField } from "../../../components/edit/EditableField";
import { useDepartments } from "../../../hooks.queries/useDepartments";
import { useProcess } from "../../../hooks.queries/useProcess";
import { useDescriptionFieldSchema } from "../../../hooks.schema/fields";
import { usePermissionsContext } from "../../../hooks.common/usePermissionsContext";

export const Details = () => {
	const process = useProcess();
	const isImported = process.CreationStatus === "ocsImported";
	const descriptionFieldSchema = useDescriptionFieldSchema();
	const { departmentOptions } = useDepartments();
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();

	return (
		<>
			<EditableField
				defaultElement={
					<p className="typo-h5">{process.Description}</p>
				}
				inputName="description"
				label={t("description")}
				schema={descriptionFieldSchema}
				disableEdit={!(permissions?.edit || permissions?.admin) || isImported}
			/>
			<EditableField
				className="mt-7"
				defaultElement={
					<p className="typo-h4 max-w-[15.3rem]">
						{process?._Department?.Description}
					</p>
				}
				defaultValue={departmentOptions}
				inputName="departmentId"
				inputType="select"
				label={t("department")}
				selectedValue={process?._Department?.ID}
				disableEdit={!(permissions?.edit || permissions?.admin) || isImported}
			/>
			<div className="mt-7">
				<span className="block text-grey-light mb-1.5">
					{t("batchSize", {
						defaultValue: "Batch size",
					})}
				</span>
				<div className={`editable__text typo-h5`}>
					{process.BatchSize}
				</div>
			</div>
		</>
	);
};
