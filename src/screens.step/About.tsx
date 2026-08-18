import { useTranslation } from "react-i18next";
import { EditableField } from "../components/edit/EditableField";
import { useStep } from "../hooks.queries/useStep";
import { useNotesFieldSchema } from "../hooks.schema/fields";
import { usePermissionsContext } from "../hooks.common/usePermissionsContext";

export const About = () => {
	const { step } = useStep();
	const notesFieldSchema = useNotesFieldSchema();
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();

	return (
		<div className="grid-container">
			<div className="col-span-6">
				<EditableField
					defaultElement={
						<p className="typo-h4 text-grey-light whitespace-pre-line">
							{step.Notes}
						</p>
					}
					disableEdit={!(permissions?.edit || permissions?.admin)}
					inputType="textarea"
					inputName="notes"
					label={t("about")}
					schema={notesFieldSchema}
				/>
			</div>
		</div>
	);
};
