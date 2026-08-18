import { useTranslation } from "react-i18next";
import { EditableField } from "../../components/edit/EditableField";
import { useProcessDefinition } from "../../hooks.queries/useProcessDefinition";
import { useNotesFieldSchema } from "../../hooks.schema/fields";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";

export const Description = () => {
	const definition = useProcessDefinition();
	const { t } = useTranslation();
	const notesFieldSchema = useNotesFieldSchema();
	const { permissions } = usePermissionsContext();

	return (
		<div className="grid-container">
			<div className="col-span-6">
				<EditableField
					defaultElement={
						<p className="typo-h4 text-grey-light whitespace-pre-line">
							{definition.Notes}
						</p>
					}
					disableEdit={!(permissions?.edit || permissions?.admin) || definition.IsInUseByOp}
					inputType="textarea"
					inputName="notes"
					label={t("description")}
					schema={notesFieldSchema}
					placeholder={t("addDescription", {
						defaultValue: "Add a description...",
					})}
				/>
			</div>
		</div>
	);
};
