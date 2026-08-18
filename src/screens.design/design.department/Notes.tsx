import { useTranslation } from "react-i18next";
import { EditableField } from "../../components/edit/EditableField";
import { useDesignDepartment } from "../../hooks.queries/useDesignDepartment";
import { useNotesFieldSchema } from "../../hooks.schema/fields";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";

export const Notes = () => {
	const styleDepartment = useDesignDepartment();
	const notesFieldSchema = useNotesFieldSchema();
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();

	return (
		<div className="grid-container">
			<div className="col-span-6">
				<EditableField
					defaultElement={
						<p className="typo-h4 text-grey-light whitespace-pre-line">
							{styleDepartment.Notes}
						</p>
					}
					disableEdit={!permissions.admin}
					inputType="textarea"
					inputName="notes"
					label={t("notes")}
					schema={notesFieldSchema}
				/>
			</div>
		</div>
	);
};
